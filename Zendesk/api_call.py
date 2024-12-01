import http.client
import json
import mysql.connector

# Conexión a la base de datos
conexion = mysql.connector.connect(
    host="localhost",
    user="tu_usuario",
    password="tu_password",
    database="tu_base_de_datos"
)

cursor = conexion.cursor()

conn = http.client.HTTPSConnection("casd.zendesk.com")

payload = ""
iPage = 1;

while iPage < 10:
    headers = {
        'Content-Type': "application/json",
        'Authorization': "Basic YWRtaW5tYWNAY2FzZC5jb20ubXgvdG9rZW46R3dnVzI2bVBhVXA2VnpXYWdnZkJyQ0hvbEdzZ1F2eUpZN1F5T2M3Nw=="
        }

    conn.request("GET", "/api/v2/tickets.json?page=" + iPage, payload, headers)
    res = conn.getresponse()
    if res.status == 200:
        datos = res.read().decode("utf-8")
        response_json = json.loads(datos)
        for ticket in response_json["tickets"]:
            cursor.execute("""
                INSERT INTO ticket (
                    id, url, external_id, created_at, updated_at,
                    generated_timestamp, type, subject, raw_subject,
                    description, priority, status, recipient,
                    requester_id, submitter_id, assignee_id,
                    organization_id, group_id, has_incidents,
                    is_public, due_at, custom_status_id,
                    encoded_id, brand_id, allow_channelback,
                    allow_attachments, from_messaging_channel
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    
                    

conn.request("GET", "/api/v2/tickets.json?page=" + iPage, payload, headers)

res = conn.getresponse()

# Verificar si la respuesta fue exitosa
if res.status == 200:
    # Leer y decodificar el contenido de la respuesta
    datos = res.read().decode("utf-8")
    
    # Convertir el contenido de la respuesta a JSON
    response_json = json.loads(datos)
    
    # Procesar cada ticket en el JSON
    for ticket in response_json["tickets"]:
        # Validar si el ticket ya existe
        cursor.execute("SELECT COUNT(*) FROM ticket WHERE id = %s", (ticket["id"],))
        existe = cursor.fetchone()[0] > 0

        if existe:
            # Actualizar ticket existente
            cursor.execute("""
                UPDATE ticket SET
                    url = %s, external_id = %s, created_at = %s, updated_at = %s, 
                    generated_timestamp = %s, type = %s, subject = %s, raw_subject = %s, 
                    description = %s, priority = %s, status = %s, recipient = %s, 
                    requester_id = %s, submitter_id = %s, assignee_id = %s, 
                    organization_id = %s, group_id = %s, has_incidents = %s, 
                    is_public = %s, due_at = %s, custom_status_id = %s, 
                    encoded_id = %s, brand_id = %s, allow_channelback = %s, 
                    allow_attachments = %s, from_messaging_channel = %s
                WHERE id = %s
            """, (
                ticket["url"], ticket.get("external_id"), ticket["created_at"], ticket["updated_at"], 
                ticket["generated_timestamp"], ticket["type"], ticket["subject"], 
                ticket["raw_subject"], ticket["description"], ticket["priority"], ticket["status"], 
                ticket.get("recipient"), ticket["requester_id"], ticket.get("submitter_id"), 
                ticket.get("assignee_id"), ticket.get("organization_id"), ticket.get("group_id"), 
                ticket.get("has_incidents", False), ticket.get("is_public", True), ticket.get("due_at"), 
                ticket.get("custom_status_id"), ticket.get("encoded_id"), ticket.get("brand_id"), 
                ticket.get("allow_channelback", False), ticket.get("allow_attachments", True), 
                ticket.get("from_messaging_channel", False), ticket["id"]
            ))
            print(f"Ticket {ticket['id']} actualizado.")
        else:
            # Insertar nuevo ticket
            cursor.execute("""
                INSERT INTO ticket (
                    id, url, external_id, created_at, updated_at, generated_timestamp, type, 
                    subject, raw_subject, description, priority, status, recipient, requester_id, 
                    submitter_id, assignee_id, organization_id, group_id, has_incidents, is_public, 
                    due_at, custom_status_id, encoded_id, brand_id, allow_channelback, 
                    allow_attachments, from_messaging_channel
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                ticket["id"], ticket["url"], ticket.get("external_id"), ticket["created_at"], 
                ticket["updated_at"], ticket["generated_timestamp"], ticket["type"], 
                ticket["subject"], ticket["raw_subject"], ticket["description"], 
                ticket["priority"], ticket["status"], ticket.get("recipient"), 
                ticket["requester_id"], ticket.get("submitter_id"), ticket.get("assignee_id"), 
                ticket.get("organization_id"), ticket.get("group_id"), ticket.get("has_incidents", False), 
                ticket.get("is_public", True), ticket.get("due_at"), ticket.get("custom_status_id"), 
                ticket.get("encoded_id"), ticket.get("brand_id"), ticket.get("allow_channelback", False), 
                ticket.get("allow_attachments", True), ticket.get("from_messaging_channel", False)
            ))
            print(f"Ticket {ticket['id']} insertado.")

        # Manejo de etiquetas (tags): eliminar y volver a insertar para mantener consistencia
        cursor.execute("DELETE FROM ticket_tags WHERE ticket_id = %s", (ticket["id"],))
        for tag in ticket["tags"]:
            cursor.execute("INSERT INTO ticket_tags (ticket_id, tag) VALUES (%s, %s)", (ticket["id"], tag))

        # Manejo de campos personalizados (custom_fields): eliminar y volver a insertar
        cursor.execute("DELETE FROM custom_fields WHERE ticket_id = %s", (ticket["id"],))
        for field in ticket.get("custom_fields", []):
            cursor.execute("""
                INSERT INTO custom_fields (ticket_id, field_id, value) 
                VALUES (%s, %s, %s)
            """, (ticket["id"], field["id"], field["value"]))

        # Manejo de satisfacción: actualizar o insertar según corresponda
        satisfaction = ticket.get("satisfaction_rating")
        if satisfaction:
            cursor.execute("DELETE FROM satisfaction_rating WHERE ticket_id = %s", (ticket["id"],))
            cursor.execute("""
                INSERT INTO satisfaction_rating (ticket_id, score, rating_id, comment, reason, reason_id) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                ticket["id"], satisfaction["score"], satisfaction["id"], satisfaction["comment"], 
                satisfaction["reason"], satisfaction["reason_id"]
            ))

    # Confirmar cambios y cerrar conexión
    conexion.commit()
    conexion.close()

    print("Proceso de inserción/actualización de tickets completado.")
else:
    print(f"Error al obtener los datos: {res.status}")

# Cerrar la conexión
conn.close()