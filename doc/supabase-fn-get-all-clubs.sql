
create
or replace function get_all_clubs3(user_id_in text, page int, page_size int) 
returns setof clubs language sql as 
$$ 
    select *
    from clubs 
    where
    club_id not in 
    (
        select club_id from club_memberships
        where user_id::text = user_id_in
    )
    limit page_size offset (page-1) * page_size;
$$;