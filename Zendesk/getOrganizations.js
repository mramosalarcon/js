const data = JSON.stringify(false);
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

let uri = 'https://casd.zendesk.com/api/v2/incremental/organizations?start_time=0&per_page=100';
let flgEndOfStream = false;
const procesarOrgs = async () => {

  do {
    const request = await new Request(uri, {
      method: 'GET',
      headers: myHeaders
    });

    await fetch(request)
      .then((response) => response.json())
      .then(async (data) => {
        const conexion = await conectarBD();

        for (const org of data.organizations) {
          // Insertar o actualizar en la tabla organizations
          await conexion.query(`
        INSERT INTO organizations (
          id, url, name, shared_tickets, shared_comments, external_id, created_at, updated_at, details, notes, group_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          url = VALUES(url),
          name = VALUES(name),
          shared_tickets = VALUES(shared_tickets),
          shared_comments = VALUES(shared_comments),
          external_id = VALUES(external_id),
          created_at = VALUES(created_at),
          updated_at = VALUES(updated_at),
          details = VALUES(details),
          notes = VALUES(notes),
          group_id = VALUES(group_id)
      `, [
            sanitizeValue(org.id),
            sanitizeValue(org.url),
            sanitizeValue(org.name),
            sanitizeValue(org.shared_tickets),
            sanitizeValue(org.shared_comments),
            sanitizeValue(org.external_id),
            formatDateTime(org.created_at),
            formatDateTime(org.updated_at),
            sanitizeValue(org.details),
            sanitizeValue(org.notes),
            sanitizeValue(org.group_id)
          ]);
          console.log(`Organizacion ${org.id} insertada!`);

          // Eliminar los nombres de dominio actuales para la organización (para evitar duplicados)
          await conexion.query(`
        DELETE FROM organization_domain_names WHERE organization_id = ?
      `, [org.id]);

          // Insertar nuevos nombres de dominio
          for (const domain of org.domain_names) {
            await conexion.query(`
          INSERT INTO organization_domain_names (organization_id, domain_name)
          VALUES (?, ?)
        `, [org.id, domain]);
          }
          console.log(`Nombres de dominio: ${org.id} insertados!`);

          // Eliminar etiquetas actuales para la organización (vacío en este caso)
          await conexion.query(`
        DELETE FROM organization_tags WHERE organization_id = ?
      `, [org.id]);

          // Insertar etiquetas si existen
          for (const tag of org.tags) {
            await conexion.query(`
          INSERT INTO organization_tags (organization_id, tag)
          VALUES (?, ?)
        `, [org.id, tag]);
          }
          console.log(`Tags de dominio: ${org.id} insertados!`);

          // Eliminar campos adicionales actuales para la organización (vacío en este caso)
          await conexion.query(`
        DELETE FROM organization_fields WHERE organization_id = ?
      `, [org.id]);

          // Insertar nuevos campos adicionales si existen
          for (const [key, value] of Object.entries(org.organization_fields)) {
            await conexion.query(`
          INSERT INTO organization_fields (organization_id, field_key, field_value)
          VALUES (?, ?, ?)
        `, [org.id, key, value]);
          }
          console.log(`Campos adicionales de dominio: ${org.id} insertados!`);
        }
        await conexion.end();
        uri = data.next_page;
        flgEndOfStream = data.end_of_stream;
      });

    console.log("URI:", uri);
  } while (uri != null && !flgEndOfStream);
  console.log("Proceso de organzaciones completado!");

};

procesarOrgs().catch(err => console.error("Error procesando organizattions:", err));
