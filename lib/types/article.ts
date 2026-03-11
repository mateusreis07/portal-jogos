export interface Article {
  id: string;
  slug: string;
  locale: string;
  title: string;
  meta_description: string | null;
  content: string;
  target_tag: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
