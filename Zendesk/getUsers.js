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

let uri = 'https://casd.zendesk.com/api/v2/incremental/users?start_time=0';
let flgEndOfStream = false;
const procesarUsers = async () => {

  do {
    const request = await new Request(uri, {
      method: 'GET',
      headers: myHeaders
    });

    await fetch(request)
      .then((response) => response.json())
      .then(async (data) => {
        const conexion = await conectarBD();
        for (const user of data.users) {
          // Insertar o actualizar datos en la tabla users
          await conexion.execute(
            `INSERT INTO users (id, url, name, email, created_at, updated_at, time_zone, iana_time_zone, phone, 
            shared_phone_number, locale_id, locale, organization_id, role, verified, external_id, alias, active, shared, 
            shared_agent, last_login_at, two_factor_auth_enabled, signature, details, notes, role_type, custom_role_id, 
            moderator, ticket_restriction, only_private_comments, restricted_agent, suspended, default_group_id, report_csv, user_fields) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                url = VALUES(url),
                name = VALUES(name),
                email = VALUES(email),
                updated_at = VALUES(updated_at),
                time_zone = VALUES(time_zone),
                iana_time_zone = VALUES(iana_time_zone),
                phone = VALUES(phone),
                shared_phone_number = VALUES(shared_phone_number),
                locale_id = VALUES(locale_id),
                locale = VALUES(locale),
                organization_id = VALUES(organization_id),
                role = VALUES(role),
                verified = VALUES(verified),
                alias = VALUES(alias),
                active = VALUES(active),
                shared = VALUES(shared),
                shared_agent = VALUES(shared_agent),
                last_login_at = VALUES(last_login_at),
                two_factor_auth_enabled = VALUES(two_factor_auth_enabled),
                signature = VALUES(signature),
                details = VALUES(details), 
                notes = VALUES(notes),
                role_type = VALUES(role_type),
                custom_role_id = VALUES(custom_role_id),
                moderator = VALUES(moderator),
                ticket_restriction = VALUES(ticket_restriction),
                only_private_comments = VALUES(only_private_comments),
                restricted_agent = VALUES(restricted_agent),
                suspended = VALUES(suspended),
                default_group_id = VALUES(default_group_id),
                report_csv = VALUES(report_csv),
                user_fields = VALUES(user_fields)`
            , [
              sanitizeValue(user.id),
              sanitizeValue(user.url),
              sanitizeValue(user.name),
              sanitizeValue(user.email),
              formatDateTime(user.created_at),
              formatDateTime(user.updated_at),
              sanitizeValue(user.time_zone),
              sanitizeValue(user.iana_time_zone),
              sanitizeValue(user.phone),
              sanitizeValue(user.shared_phone_number),
              sanitizeValue(user.locale_id),
              sanitizeValue(user.locale),
              sanitizeValue(user.organization_id),
              sanitizeValue(user.role),
              sanitizeValue(user.verified),
              sanitizeValue(user.external_id),
              sanitizeValue(user.alias),
              sanitizeValue(user.active),
              sanitizeValue(user.shared),
              sanitizeValue(user.shared_agent),
              formatDateTime(user.last_login_at),
              sanitizeValue(user.two_factor_auth_enabled),
              sanitizeValue(user.signature),
              sanitizeValue(user.details),
              sanitizeValue(user.notes),
              sanitizeValue(user.role_type),
              sanitizeValue(user.custom_role_id),
              sanitizeValue(user.moderator),
              sanitizeValue(user.ticket_restriction),
              sanitizeValue(user.only_private_comments),
              sanitizeValue(user.restricted_agent),
              sanitizeValue(user.suspended),
              sanitizeValue(user.default_group_id),
              sanitizeValue(user.report_csv),
              JSON.stringify(user.user_fields)
            ]
          );
          console.log(`User ${user.id} insertado!`);

          // Insertar o actualizar datos en la tabla user_photos
          if (user.photo) {
            await conexion.execute(
              `INSERT INTO user_photos (id, user_id, url, file_name, content_url, mapped_content_url, content_type, size, 
                width, height, inline, deleted) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    url = VALUES(url),
                    file_name = VALUES(file_name),
                    content_url = VALUES(content_url),
                    mapped_content_url = VALUES(mapped_content_url),
                    content_type = VALUES(content_type),
                    size = VALUES(size),
                    width = VALUES(width),
                    height = VALUES(height),
                    inline = VALUES(inline),
                    deleted = VALUES(deleted)`,
              [
                user.photo.id, user.id, user.photo.url, user.photo.file_name, user.photo.content_url,
                user.photo.mapped_content_url, user.photo.content_type, user.photo.size,
                user.photo.width, user.photo.height, user.photo.inline, user.photo.deleted
              ]
            );
            console.log(`Photo user ${user.photo.id} insertado!`);

            // Insertar o actualizar datos en la tabla photo_thumbnails
            for (const thumbnail of user.photo.thumbnails) {
              await conexion.execute(
                `INSERT INTO photo_thumbnails (id, photo_id, url, file_name, content_url, mapped_content_url, content_type, size, 
                    width, height, inline, deleted) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        url = VALUES(url),
                        file_name = VALUES(file_name),
                        content_url = VALUES(content_url),
                        mapped_content_url = VALUES(mapped_content_url),
                        content_type = VALUES(content_type),
                        size = VALUES(size),
                        width = VALUES(width),
                        height = VALUES(height),
                        inline = VALUES(inline),
                        deleted = VALUES(deleted)`,
                [
                  thumbnail.id, user.photo.id, thumbnail.url, thumbnail.file_name, thumbnail.content_url,
                  thumbnail.mapped_content_url, thumbnail.content_type, thumbnail.size,
                  thumbnail.width, thumbnail.height, thumbnail.inline, thumbnail.deleted
                ]
              );
              console.log(`Thumbnail ${thumbnail.id} insertado!`);
            }
          }
        }
        await conexion.end();
        uri = data.next_page;
        flgEndOfStream = data.end_of_stream;
      });

    console.log("URI:", uri);
  } while (uri != null && !flgEndOfStream);
  console.log("Proceso de users completado!");

};

procesarUsers().catch(err => console.error("Error procesando users:", err));
