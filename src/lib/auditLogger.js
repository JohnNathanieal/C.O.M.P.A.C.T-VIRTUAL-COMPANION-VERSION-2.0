const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


export async function logAction(action, entityType = '', details = '', status = 'success') {
  try {
    await db.entities.AuditLog.create({ action, entity_type: entityType, details, status });
  } catch {}
}