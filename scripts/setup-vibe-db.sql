-- SCHEMA DE REAÇÕES (VIBE) COM TRIGGER AUTOMÁTICO
-- Execute este script no SQL Editor do seu Supabase

-- 0. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela de Logs (Individual)
CREATE TABLE IF NOT EXISTS public.game_reactions_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_slug TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  user_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(game_slug, user_fingerprint)
);

-- 2. Tabela de Totais (Agregada)
CREATE TABLE IF NOT EXISTS public.game_reactions_counts (
  game_slug TEXT PRIMARY KEY,
  fire INTEGER DEFAULT 0,
  mindblown INTEGER DEFAULT 0,
  funny INTEGER DEFAULT 0,
  chill INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.game_reactions_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_reactions_logs ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
-- Counts: Todos podem ler, mas ninguém escreve direto (apenas via trigger)
DROP POLICY IF EXISTS "Leitura pública" ON public.game_reactions_counts;
CREATE POLICY "Leitura pública" ON public.game_reactions_counts FOR SELECT USING (true);

-- Logs: Todos podem ler e gerenciar seus próprios logs
DROP POLICY IF EXISTS "Leitura pública logs" ON public.game_reactions_logs;
CREATE POLICY "Leitura pública logs" ON public.game_reactions_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção anônima" ON public.game_reactions_logs;
CREATE POLICY "Inserção anônima" ON public.game_reactions_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update anônimo" ON public.game_reactions_logs;
CREATE POLICY "Update anônimo" ON public.game_reactions_logs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Delete anônimo" ON public.game_reactions_logs;
CREATE POLICY "Delete anônimo" ON public.game_reactions_logs FOR DELETE USING (true);

-- 4. Função da Trigger (IMPORTANTE: SECURITY DEFINER faz rodar com permissões de admin)
CREATE OR REPLACE FUNCTION public.update_game_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.game_reactions_counts (game_slug, fire, mindblown, funny, chill)
    VALUES (OLD.game_slug, 
      CASE WHEN OLD.reaction_type = 'fire' THEN -1 ELSE 0 END,
      CASE WHEN OLD.reaction_type = 'mindblown' THEN -1 ELSE 0 END,
      CASE WHEN OLD.reaction_type = 'funny' THEN -1 ELSE 0 END,
      CASE WHEN OLD.reaction_type = 'chill' THEN -1 ELSE 0 END
    ) ON CONFLICT (game_slug) DO UPDATE SET
      fire = game_reactions_counts.fire + EXCLUDED.fire,
      mindblown = game_reactions_counts.mindblown + EXCLUDED.mindblown,
      funny = game_reactions_counts.funny + EXCLUDED.funny,
      chill = game_reactions_counts.chill + EXCLUDED.chill,
      updated_at = now();
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.game_reactions_counts (game_slug, fire, mindblown, funny, chill)
    VALUES (NEW.game_slug, 
      CASE WHEN NEW.reaction_type = 'fire' THEN 1 ELSE 0 END,
      CASE WHEN NEW.reaction_type = 'mindblown' THEN 1 ELSE 0 END,
      CASE WHEN NEW.reaction_type = 'funny' THEN 1 ELSE 0 END,
      CASE WHEN NEW.reaction_type = 'chill' THEN 1 ELSE 0 END
    ) ON CONFLICT (game_slug) DO UPDATE SET
      fire = game_reactions_counts.fire + EXCLUDED.fire,
      mindblown = game_reactions_counts.mindblown + EXCLUDED.mindblown,
      funny = game_reactions_counts.funny + EXCLUDED.funny,
      chill = game_reactions_counts.chill + EXCLUDED.chill,
      updated_at = now();
  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE public.game_reactions_counts SET
      fire = fire - (CASE WHEN OLD.reaction_type = 'fire' THEN 1 ELSE 0 END) + (CASE WHEN NEW.reaction_type = 'fire' THEN 1 ELSE 0 END),
      mindblown = mindblown - (CASE WHEN OLD.reaction_type = 'mindblown' THEN 1 ELSE 0 END) + (CASE WHEN NEW.reaction_type = 'mindblown' THEN 1 ELSE 0 END),
      funny = funny - (CASE WHEN OLD.reaction_type = 'funny' THEN 1 ELSE 0 END) + (CASE WHEN NEW.reaction_type = 'funny' THEN 1 ELSE 0 END),
      chill = chill - (CASE WHEN OLD.reaction_type = 'chill' THEN 1 ELSE 0 END) + (CASE WHEN NEW.reaction_type = 'chill' THEN 1 ELSE 0 END),
      updated_at = now()
    WHERE game_slug = NEW.game_slug;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Vincular a Trigger
DROP TRIGGER IF EXISTS tr_update_counts ON public.game_reactions_logs;
CREATE TRIGGER tr_update_counts
AFTER INSERT OR UPDATE OR DELETE ON public.game_reactions_logs
FOR EACH ROW EXECUTE FUNCTION public.update_game_reaction_counts();
