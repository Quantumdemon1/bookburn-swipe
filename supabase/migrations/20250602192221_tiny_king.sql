-- Create function to get books with average ratings
create or replace function get_books_with_ratings()
returns table (
  id bigint,
  title text,
  author text,
  price numeric(10,2),
  tags text[],
  preview text,
  cover_url text,
  avg_rating numeric(3,2)
) as $$
begin
  return query
  select 
    b.id,
    b.title,
    b.author,
    b.price,
    b.tags,
    b.preview,
    b.cover_url,
    coalesce(avg(r.rating)::numeric(3,2), 0) as avg_rating
  from books b
  left join reviews r on b.id = r.book_id
  group by b.id, b.title, b.author, b.price, b.tags, b.preview, b.cover_url;
end;
$$ language plpgsql;