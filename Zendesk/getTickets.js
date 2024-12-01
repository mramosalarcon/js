const mysql = require("mysql2/promise");

// Conexión a la base de datos
const conectarBD = async () => {
  return await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "mysql",
    database: "zendesk",
    port: 3306
  });
};

function formatDateTime(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
};
function sanitizeValue(value) {
  return value === undefined ? null : value;
};

const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWRtaW5tYWNAY2FzZC5jb20ubXgvdG9rZW46R3dnVzI2bVBhVXA2VnpXYWdnZkJyQ0hvbEdzZ1F2eUpZN1F5T2M3Nw");
myHeaders.append("Content-Type", "application/json");

let uri = 'https://casd.zendesk.com/api/v2/tickets.json';
let flgEndOfStream = false;

const procesarTickets = async () => {

  do {
    const request = await new Request(uri, {
      method: 'GET',
      headers: myHeaders
    });

    await fetch(request)
      .then((response) => response.json())
      .then(async (data) => {
        const conexion = await conectarBD();
        for (const ticket of data.tickets) {
          // Validar si el ticket ya existe
          const [result] = await conexion.execute("SELECT COUNT(*) AS count FROM tickets WHERE id = ?", [ticket.id]);
          const existe = result[0].count > 0;

          if (existe) {
            // Actualizar ticket existente
            await conexion.execute(`
            UPDATE tickets SET 
              url = ?, external_id = ?, created_at = ?, updated_at = ?, 
              generated_timestamp = ?, type = ?, subject = ?, raw_subject = ?, 
              description = ?, priority = ?, status = ?, recipient = ?, 
              requester_id = ?, submitter_id = ?, assignee_id = ?, 
              organization_id = ?, group_id = ?, has_incidents = ?, 
              is_public = ?, due_at = ?, custom_status_id = ?, 
              encoded_id = ?, brand_id = ?, allow_channelback = ?, 
              allow_attachments = ?, from_messaging_channel = ? 
            WHERE id = ?
          `, [
              sanitizeValue(ticket.url),
              sanitizeValue(ticket.external_id),
              formatDateTime(ticket.created_at),
              formatDateTime(ticket.updated_at),
              sanitizeValue(ticket.generated_timestamp),
              sanitizeValue(ticket.type),
              sanitizeValue(ticket.subject),
              sanitizeValue(ticket.raw_subject),
              sanitizeValue(ticket.description),
              sanitizeValue(ticket.priority),
              sanitizeValue(ticket.status),
              sanitizeValue(ticket.recipient),
              sanitizeValue(ticket.requester_id),
              sanitizeValue(ticket.submitter_id),
              sanitizeValue(ticket.assignee_id),
              sanitizeValue(ticket.organization_id),
              sanitizeValue(ticket.group_id),
              sanitizeValue(ticket.has_incidents),
              sanitizeValue(ticket.is_public),
              formatDateTime(ticket.due_at),
              sanitizeValue(ticket.custom_status_id),
              sanitizeValue(ticket.encoded_id),
              sanitizeValue(ticket.brand_id),
              sanitizeValue(ticket.allow_channelback),
              sanitizeValue(ticket.allow_attachments),
              sanitizeValue(ticket.from_messaging_channel),
              sanitizeValue(ticket.id)
            ]);
            console.log(`Ticket ${ticket.id} actualizado!`);
          } else {
            // Insertar nuevo ticket
            await conexion.execute(`
            INSERT INTO tickets (
              id, url, external_id, created_at, updated_at, generated_timestamp, type, 
              subject, raw_subject, description, priority, status, recipient, requester_id, 
              submitter_id, assignee_id, organization_id, group_id, has_incidents, is_public, 
              due_at, custom_status_id, encoded_id, brand_id, allow_channelback, 
              allow_attachments, from_messaging_channel
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
              sanitizeValue(ticket.id),
              sanitizeValue(ticket.url),
              sanitizeValue(ticket.external_id),
              formatDateTime(ticket.created_at),
              formatDateTime(ticket.updated_at),
              sanitizeValue(ticket.generated_timestamp),
              sanitizeValue(ticket.type),
              sanitizeValue(ticket.subject),
              sanitizeValue(ticket.raw_subject),
              sanitizeValue(ticket.description),
              sanitizeValue(ticket.priority),
              sanitizeValue(ticket.status),
              sanitizeValue(ticket.recipient),
              sanitizeValue(ticket.requester_id),
              sanitizeValue(ticket.submitter_id),
              sanitizeValue(ticket.assignee_id),
              sanitizeValue(ticket.organization_id),
              sanitizeValue(ticket.group_id),
              sanitizeValue(ticket.has_incidents),
              sanitizeValue(ticket.is_public),
              formatDateTime(ticket.due_at),
              sanitizeValue(ticket.custom_status_id),
              sanitizeValue(ticket.encoded_id),
              sanitizeValue(ticket.brand_id),
              sanitizeValue(ticket.allow_channelback),
              sanitizeValue(ticket.allow_attachments),
              sanitizeValue(ticket.from_messaging_channel)
            ]);
            console.log(`Ticket ${ticket.id} insertado!`);
          }
          // Manejar fields (fields): eliminar y volver a insertar
          await conexion.execute("DELETE FROM fields WHERE ticket_id = ?", [ticket.id]);
          for (const field of ticket.fields) {
            await conexion.execute("INSERT INTO fields (ticket_id, field_id, value) VALUES (?, ?, ?)", [ticket.id, field.id, field.value]);
          }
          // Manejar etiquetas (tags): eliminar y volver a insertar
          await conexion.execute("DELETE FROM ticket_tags WHERE ticket_id = ?", [ticket.id]);
          for (const tag of ticket.tags) {
            await conexion.execute("INSERT INTO ticket_tags (ticket_id, tag) VALUES (?, ?)", [ticket.id, tag]);
          }

          // Manejar campos personalizados (custom_fields): eliminar y volver a insertar
          await conexion.execute("DELETE FROM custom_fields WHERE ticket_id = ?", [ticket.id]);
          for (const field of ticket.custom_fields || []) {
            await conexion.execute(`
            INSERT INTO custom_fields (ticket_id, field_id, value) 
            VALUES (?, ?, ?)
          `, [ticket.id, field.id, sanitizeValue(field.value)]);
          }

          // Manejar satisfacción (satisfaction_rating)
          if (ticket.satisfaction_rating) {
            await conexion.execute("DELETE FROM satisfaction_rating WHERE ticket_id = ?", [ticket.id]);
            await conexion.execute(`
            INSERT INTO satisfaction_rating (ticket_id, score, rating_id, comment, reason, reason_id) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
              ticket.id, sanitizeValue(ticket.satisfaction_rating.score),
              sanitizeValue(ticket.satisfaction_rating.id),
              sanitizeValue(ticket.satisfaction_rating.comment),
              sanitizeValue(ticket.satisfaction_rating.reason),
              sanitizeValue(ticket.satisfaction_rating.reason_id)
            ]);
          }

        }
        await conexion.end();
        uri = data.next_page;
        console.log("URI:", uri);
        flgEndOfStream = data.end_of_stream;
      })
  } while (uri != null && !flgEndOfStream);
  console.log("Proceso de tickets completado.");

};

procesarTickets().catch(err => console.error("Error procesando tickets:", err));
