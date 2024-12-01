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

let uri = 'https://casd.zendesk.com/api/v2/ticket_metrics.json';
let flgEndOfStream = false;

const procesarTicketMetrics = async () => {

  do {
    const request = await new Request(uri, {
      method: 'GET',
      headers: myHeaders
    });

    await fetch(request)
      .then((response) => response.json())
      .then(async (data) => {
        const conexion = await conectarBD();
        for (const ticket of data.ticket_metrics) {
          // Validar si el ticket ya existe
          const [result] = await conexion.execute("SELECT COUNT(*) AS count FROM ticket_metrics WHERE id = ?", [ticket.id]);
          const existe = result[0].count > 0;

          if (existe) {
            // Actualizar ticket existente
            await conexion.execute(`
            UPDATE ticket_metrics SET 
            ticket_id = ?, url = ?, created_at = ?, updated_at = ?, group_stations = ?, 
            assignee_stations = ?, reopens = ?, replies = ?, assignee_updated_at = ?, requester_updated_at = ?, 
            status_updated_at = ?, initially_assigned_at = ?, assigned_at = ?, solved_at = ?, latest_comment_added_at = ?
            WHERE id = ?
          `, [
              sanitizeValue(ticket.ticket_id),
              sanitizeValue(ticket.url),
              formatDateTime(ticket.created_at),
              formatDateTime(ticket.updated_at),
              sanitizeValue(ticket.group_stations),
              sanitizeValue(ticket.assignee_stations),
              sanitizeValue(ticket.reopens),
              sanitizeValue(ticket.replies),
              formatDateTime(ticket.assignee_updated_at),
              formatDateTime(ticket.requester_updated_at),
              formatDateTime(ticket.status_updated_at),
              formatDateTime(ticket.initially_assigned_at),
              formatDateTime(ticket.assigned_at),
              formatDateTime(ticket.solved_at),
              formatDateTime(ticket.latest_comment_added_at),
              sanitizeValue(ticket.id)
            ]);

            await conexion.execute(`
              UPDATE ticket_time_metrics SET 
              reply_calendar_time = ?, reply_business_time = ?, first_resolution_calendar_time = ?, 
              first_resolution_business_time = ?, full_resolution_calendar_time = ?, full_resolution_business_time = ?,
              agent_wait_calendar_time = ?, agent_wait_business_time = ?, requester_wait_calendar_time = ?, 
              requester_wait_business_time = ?, on_hold_calendar_time = ?, on_hold_business_time = ?
              WHERE id = ?
              `, [
              sanitizeValue(ticket.reply_time_in_minutes.calendar),
              sanitizeValue(ticket.reply_time_in_minutes.business),
              sanitizeValue(ticket.first_resolution_time_in_minutes.calendar),
              sanitizeValue(ticket.first_resolution_time_in_minutes.business),
              sanitizeValue(ticket.full_resolution_time_in_minutes.calendar),
              sanitizeValue(ticket.full_resolution_time_in_minutes.business),
              sanitizeValue(ticket.agent_wait_time_in_minutes.calendar),
              sanitizeValue(ticket.agent_wait_time_in_minutes.business),
              sanitizeValue(ticket.requester_wait_time_in_minutes.calendar),
              sanitizeValue(ticket.requester_wait_time_in_minutes.business),
              sanitizeValue(ticket.on_hold_time_in_minutes.calendar),
              sanitizeValue(ticket.on_hold_time_in_minutes.business),
              sanitizeValue(ticket.id)
            ]);
            console.log(`Ticket ${ticket.id} actualizado!`);
          } else {
            // Insertar nuevo ticket
            await conexion.execute(`
            INSERT INTO ticket_metrics (
              id, ticket_id, url, created_at, updated_at, group_stations, assignee_stations, 
              reopens, replies, assignee_updated_at, requester_updated_at, status_updated_at, 
              initially_assigned_at, assigned_at, solved_at, latest_comment_added_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
              sanitizeValue(ticket.id),
              sanitizeValue(ticket.ticket_id),
              sanitizeValue(ticket.url),
              formatDateTime(ticket.created_at),
              formatDateTime(ticket.updated_at),
              sanitizeValue(ticket.group_stations),
              sanitizeValue(ticket.assignee_stations),
              sanitizeValue(ticket.reopens),
              sanitizeValue(ticket.replies),
              formatDateTime(ticket.assignee_updated_at),
              formatDateTime(ticket.requester_updated_at),
              formatDateTime(ticket.status_updated_at),
              formatDateTime(ticket.initially_assigned_at),
              formatDateTime(ticket.assigned_at),
              formatDateTime(ticket.solved_at),
              formatDateTime(ticket.latest_comment_added_at)
            ]);

            await conexion.execute(`
              INSERT INTO ticket_time_metrics (
                id, reply_calendar_time, reply_business_time, 
                first_resolution_calendar_time, first_resolution_business_time,
                full_resolution_calendar_time, full_resolution_business_time,
                agent_wait_calendar_time, agent_wait_business_time,
                requester_wait_calendar_time, requester_wait_business_time,
                on_hold_calendar_time, on_hold_business_time
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              sanitizeValue(ticket.id),
              sanitizeValue(ticket.reply_time_in_minutes.calendar),
              sanitizeValue(ticket.reply_time_in_minutes.business),
              sanitizeValue(ticket.first_resolution_time_in_minutes.calendar),
              sanitizeValue(ticket.first_resolution_time_in_minutes.business),
              sanitizeValue(ticket.full_resolution_time_in_minutes.calendar),
              sanitizeValue(ticket.full_resolution_time_in_minutes.business),
              sanitizeValue(ticket.agent_wait_time_in_minutes.calendar),
              sanitizeValue(ticket.agent_wait_time_in_minutes.business),
              sanitizeValue(ticket.requester_wait_time_in_minutes.calendar),
              sanitizeValue(ticket.requester_wait_time_in_minutes.business),
              sanitizeValue(ticket.on_hold_time_in_minutes.calendar),
              sanitizeValue(ticket.on_hold_time_in_minutes.business)
            ]);

            console.log(`Ticket ${ticket.id} insertado!`);
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

procesarTicketMetrics().catch(err => console.error("Error procesando ticket metrics:", err));
