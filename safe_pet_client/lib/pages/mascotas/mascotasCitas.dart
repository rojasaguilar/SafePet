import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:safe_pet_client/pages/citas/crearCita.dart';
import 'package:safe_pet_client/theme.dart';

class MascotasCitas extends StatefulWidget {
  final String mascotaId;
  final String nombreMascota;

  const MascotasCitas({
    super.key,
    required this.mascotaId,
    required this.nombreMascota,
  });

  @override
  State<MascotasCitas> createState() => _MascotasCitasState();
}

class _MascotasCitasState extends State<MascotasCitas> {
  List<Map<String, dynamic>> citas = [];
  bool isLoading = true;

  final String apiCitasUrl = "${Config.backendUrl}/citas";

  @override
  void initState() {
    super.initState();
    ObtenerCitasMascota();
  }

  Future<void> ObtenerCitasMascota() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        print("Usuario no autenticado");
        setState(() => isLoading = false);
        return;
      }

      final idToken = await user.getIdToken();

      final url = Uri.parse("$apiCitasUrl?mascotaId=${widget.mascotaId}");
      print("URL de petición: $url");

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final List data = body["data"];

        setState(() {
          citas = data.map<Map<String, dynamic>>((c) {
            String fechaProgramadaFormateada = '';
            String fechaCreacionFormateada = '';
            String horaProgramada = '';

            fechaProgramadaFormateada = c['fechaProgramada'] ?? '';
            horaProgramada = c['hora'] ?? '';

            if (c['fechaCreacion'] != null) {
              try {
                DateTime fecha = DateTime.parse(c['fechaCreacion']);
                fechaCreacionFormateada = "${fecha.day.toString().padLeft(2, '0')}/${fecha.month.toString().padLeft(2, '0')}/${fecha.year} ${fecha.hour.toString().padLeft(2, '0')}:${fecha.minute.toString().padLeft(2, '0')}";
              } catch (e) {
                fechaCreacionFormateada = c['fechaCreacion'].toString();
              }
            }

            return {
              'id': c['cita_id'] ?? '',
              'veterinario': c['vet_nombre'] ?? 'Sin veterinario',
              'clinica': c['clinica_nombre'] ?? 'Sin clínica',
              'fechaProgramada': fechaProgramadaFormateada,
              'hora': horaProgramada,
              'asistencia': c['asistencia'] ?? 'Pendiente',
              'fechaCreacion': fechaCreacionFormateada,
              'motivo': c['motivo'] ?? 'Sin motivo especificado',
            };
          }).toList();
          isLoading = false;
        });
      } else {
        print("Error del servidor: ${response.statusCode}");
        setState(() => isLoading = false);
      }
    } catch (e) {
      print("Error al conectar con backend: $e");
      setState(() => isLoading = false);
    }
  }

  Future<void> _cancelarCita(int index) async {
    final citaId = citas[index]['id'];

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      final idToken = await user.getIdToken();

      final url = Uri.parse("$apiCitasUrl/$citaId");
      final response = await http.delete(
        url,
        headers: {
          'Content-Type': 'application/json',
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        setState(() {
          citas.removeAt(index);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Cita cancelada correctamente")),
        );
      } else {
        print("Error al cancelar: ${response.statusCode}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al cancelar cita")),
        );
      }
    } catch (e) {
      print("Error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Citas de ${widget.nombreMascota}", style: TextStyle(fontWeight: FontWeight.bold),),
        centerTitle: true,
      ),

      body: isLoading
          ? Center(child: CircularProgressIndicator(color: Colores.azulPrimario))
          : Column(
        children: [
          Container(
            padding: EdgeInsets.all(20),
            margin: EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: Colores.azulSecundario.withOpacity(0.1),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(
                color: Colores.azulSecundario.withOpacity(0.3),
                width: 2,
              ),
            ),
            child: Row(
              children: [
                Icon(Icons.pets, color: Colores.azulSecundario, size: 40),
                SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.nombreMascota,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      SizedBox(height: 5),
                      Text("${citas.length} ${citas.length == 1 ? 'cita programada' : 'citas programadas'}",
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: citas.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_busy, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text("No hay citas programadas",
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            )
                : ListView.builder(
              itemCount: citas.length,
              itemBuilder: (context, index) {
                final cita = citas[index];
                return Card(
                  elevation: 6,
                  shadowColor: Colors.black45,
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  margin: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  child: Padding(
                    padding: EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Icon(Icons.event_available, color: Colors.blueAccent, size: 30),
                                      SizedBox(width: 10),
                                      Expanded(
                                        child: Text(cita['fechaProgramada']!,
                                          style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.black87,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                          maxLines: 2,
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (cita['hora'] != null && cita['hora'].toString().isNotEmpty)
                                    Padding(
                                      padding: EdgeInsets.only(top: 6),
                                      child: Row(
                                        children: [
                                          Icon(Icons.access_time, size: 30, color: Colors.blueAccent),
                                          SizedBox(width: 10),
                                          Text('${cita['hora']}',
                                            style: TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.black87,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            PopupMenuButton<String>(
                              onSelected: (value) {
                                if (value == 'cancelar') {
                                  showDialog(
                                    context: context,
                                    builder: (x) {
                                      return AlertDialog(
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        titlePadding: EdgeInsets.only(top: 20, left: 20, right: 20),
                                        contentPadding: EdgeInsets.zero,
                                        actionsPadding: EdgeInsets.zero,
                                        title: Column(
                                          children: [
                                            Icon(Icons.warning_amber_rounded, color: Colors.red, size: 48),
                                            SizedBox(height: 10),
                                            Text("¿Cancelar cita?",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            SizedBox(height: 8),
                                            Text("Esta acción no se puede deshacer.",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 15,
                                                color: Colors.black54,
                                              ),
                                            ),
                                            SizedBox(height: 10)
                                          ],
                                        ),
                                        actions: [
                                          Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Divider(height: 1, color: Colors.grey.withOpacity(0.3)),
                                              InkWell(
                                                onTap: () {
                                                  Navigator.pop(context);
                                                  _cancelarCita(index);
                                                },
                                                child: Container(
                                                  width: double.infinity,
                                                  padding: EdgeInsets.symmetric(vertical: 14),
                                                  alignment: Alignment.center,
                                                  child: Text("Cancelar cita",
                                                    style: TextStyle(
                                                      color: Colors.red,
                                                      fontSize: 17,
                                                      fontWeight:
                                                      FontWeight.bold,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Divider(height: 1, color: Colors.grey.withOpacity(0.3)),
                                              InkWell(
                                                onTap: () =>
                                                    Navigator.pop(context),
                                                child: Container(
                                                  width: double.infinity,
                                                  padding: EdgeInsets.symmetric(vertical: 14),
                                                  alignment: Alignment.center,
                                                  child: Text("Regresar",
                                                    style: TextStyle(
                                                      color: Colors.black87,
                                                      fontSize: 17,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                        ],
                                      );
                                    },
                                  );
                                }
                              },
                              itemBuilder: (context) {
                                return [
                                  PopupMenuItem(
                                    value: 'cancelar',
                                    child: Row(
                                      children: [
                                        Icon(Icons.cancel, size: 18, color: Colors.red),
                                        SizedBox(width: 8),
                                        Text("Cancelar",
                                            style: TextStyle(
                                                color: Colors.red,
                                                fontWeight:
                                                FontWeight.bold
                                            )
                                        )
                                      ],
                                    ),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Row(
                          children: [
                            Icon(Icons.healing, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text("Veterinario: ${cita['veterinario']}",
                                style: TextStyle(
                                    fontSize: 16, color: Colors.grey[800]),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.check_circle_outline, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Estado: ${cita['asistencia']}",
                              style: TextStyle(
                                  fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),
                        SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.history, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Creada: ${cita['fechaCreacion']}",
                              style: TextStyle(
                                  fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 50),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (x) => CrearCita()),
          ).then((creada) {
            if (creada == true) {
              ObtenerCitasMascota();
            }
          });
        },
        label: Text("Agendar cita",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        icon: Icon(Icons.add, color: Colors.white),
        backgroundColor: Colores.azulOscuro,
      ),
    );
  }
}