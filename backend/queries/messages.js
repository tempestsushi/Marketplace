export function qInsertMessage() {
  return `
    insert into messages (sender_id, receiver_id, product_id, content, is_read)
    values ($1, $2, $3, $4, false)
    returning message_id, sent_at;
  `;
}

export function qMyMessages() {
  return `
    select
      m.message_id,m.sender_id,m.receiver_id,m.product_id,m.content,m.is_read,
      m.sent_at,us.full_name as sender_name,ur.full_name as receiver_name,p.title as product_title
    from messages m
    join users us on us.user_id = m.sender_id
    join users ur on ur.user_id = m.receiver_id
    left join products p on p.product_id = m.product_id
    left join conversation_deletions cd
      on cd.user_id = $1
      and cd.other_user_id = case
        when m.sender_id = $1 then m.receiver_id
        else m.sender_id
      end
    where (m.sender_id = $1 or m.receiver_id = $1)
      and (cd.deleted_at is null or m.sent_at > cd.deleted_at)
    order by m.sent_at desc
    limit 200;
  `;
}

export function qMarkMessageRead() {
  return `
    update messages
    set is_read = true
    where message_id = $1
      and receiver_id = $2;
  `;
}

export function qHideConversationForUser() {
  return `
    insert into conversation_deletions (user_id, other_user_id, deleted_at)
    values ($1, $2, now())
    on conflict (user_id, other_user_id)
    do update set deleted_at = excluded.deleted_at;
  `;
}
