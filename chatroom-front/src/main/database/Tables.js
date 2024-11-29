const add_tables = [
  'create table if not exists avatar(' +
    '    id varchar(20) not null ,' +
    '    url varchar(256) default null ,' +
    '    primary key ( id )' +
    ');',
  'create table if not exists chat_message(' +
    '    user_id varchar not null ,' +
    '    message_id bigint not null default null ,' +
    '    session_id varchar ,' + //会话id
    '    message_type integer ,' + //消息类型
    '    message_content varchar ,' + //消息内容
    '    contact_type integer ,' + //联系人类型（群聊，单聊）
    '    send_user_id varchar ,' +
    '    send_user_nick_name varchar ,' +
    '    send_time bigint ,' +
    '    status integer ,' + //发送视频灯（发送中等）
    '    file_size bigint ,' +
    '    file_name varchar ,' +
    '    file_path varchar ,' +
    '    file_type integer ,' +
    '    primary key ( user_id , message_id )' +
    ');',
  'create table if not exists chat_session_user (' +
    '    user_id varchar not null default 0,' +
    '    contact_id varchar(15) not null ,' +
    '    contact_type integer ,' + //联系人类型（群聊，单聊）
    '    session_id varchar(15),' +
    '    status integer default 1,' + //0为删除
    '    contact_name varchar(20),' + //联系人名称
    '    last_message varchar(500),' + //最后一条消息
    '    last_receive_time bigint ,' + //最后一条消息时间
    '    no_read_count integer default 0,' + //未读消息数
    '    member_count integer ,' + //群聊人数
    '    top_type integer default 0,' + //1为置顶
    '    primary key ( user_id , contact_id )' +
    ');',
  'create table if not exists user_setting (' +
    '    user_id varchar not null ,' +
    '    email varchar not null ,' +
    '    sys_setting varchar ,' + //设置文件路径
    '    contact_no_read integer ,' + //未读好友申请数
    '    server_port integer ,' + //在本地起一个小型server使用的端口
    '    primary key ( user_id )' +
    ');'
]
const add_index = [
  'create index if not exists idx_session_id ' + ' on chat_message (' + ' session_id asc ' + ');'
]
const alter_tables = [
  // {
  //  tableName :" user_setting ",
  //  field :" email ",
  //  sql :" alter table user_setting add column email varchar "
  // }
]

export { add_tables, add_index, alter_tables }
