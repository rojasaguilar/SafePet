import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/citas/actualizarCita.dart';
import 'package:safe_pet_client/pages/citas/crearCita.dart';
import 'package:safe_pet_client/theme.dart';

class PantallaCitas extends StatefulWidget {
  PantallaCitas({super.key});

  @override
  _CitasScreenState createState() => _CitasScreenState();
}

class _CitasScreenState extends State<PantallaCitas> {
  List<Map<String, dynamic>> citas = [];

  final String apiCitasUrl = "${Config.backendUrl}/citas";

  @override
  void initState() {
    super.initState();
    ObtenerCitas();
  }

  Future<void> ObtenerCitas() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        print("Usuario no autenticado");
        return;
      }

      final idToken = await user.getIdToken();
      final url = Uri.parse("$apiCitasUrl?uid=${user.uid}");

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

        final citasConClinicas = await Future.wait(
          data.map((c) async {
            String nombreClinica = 'Sin clínica';

            if (c['clinica_id'] != null && c['clinica_id']['_path'] != null) {
              final segments = c['clinica_id']['_path']['segments'];
              if (segments != null && segments.length >= 2) {
                final clinicaId = segments[1];

                try {
                  final clinicaUrl = Uri.parse("${Config.backendUrl}/clinicas/$clinicaId");
                  final clinicaResp = await http.get(clinicaUrl);

                  if (clinicaResp.statusCode == 200) {
                    final clinicaData = jsonDecode(clinicaResp.body);
                    nombreClinica = clinicaData['data']['nombre'] ?? 'Sin clínica';
                  }
                } catch (e) {
                  print("Error obteniendo clínica: $e");
                }
              }
            }

            String fechaProgramadaFormateada = '';
            String horaProgramada = '';
            if (c['fechaProgramada'] != null) {
              fechaProgramadaFormateada = c['fechaProgramada'].toString();
            }
            if (c['hora'] != null) {
              horaProgramada = c['hora'].toString();
            }

            String fechaCreacionFormateada = '';
            if (c['fechaCreacion'] != null) {
              try {
                if (c['fechaCreacion'] is String) {
                  DateTime fecha = DateTime.parse(c['fechaCreacion']);
                  fechaCreacionFormateada = "${fecha.day.toString().padLeft(2, '0')}/${fecha.month.toString().padLeft(2, '0')}/${fecha.year} ${fecha.hour.toString().padLeft(2, '0')}:${fecha.minute.toString().padLeft(2, '0')}";
                } else {
                  fechaCreacionFormateada = c['fechaCreacion'].toString();
                }
              } catch (e) {
                fechaCreacionFormateada = 'Fecha no disponible';
              }
            }

            return {
              'id': c['cita_id'],
              'mascota': c['mascota_nombre'],
              'dueño': c['dueno_nombre'],
              'veterinario': c['vet_nombre'],
              'clinica': nombreClinica,
              'fechaProgramada': fechaProgramadaFormateada,
              'hora': horaProgramada,
              'asistencia': c['asistencia'],
              'fechaCreacion': fechaCreacionFormateada,
            };
          }),
        );

        setState(() {
          citas = citasConClinicas;
        });
      }
    } catch (e) {
      print("Error al conectar con backend: $e");
    }
  }

  Future<void> _cancelarCita(int index) async {
    final citaId = citas[index]['id'];

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Usuario no autenticado")),
        );
        return;
      }

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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al cancelar cita: ${response.statusCode}")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.only(top: 10, left: 20,),
                child: Text("Cuidados para tu mascota",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              Container(
                padding: EdgeInsets.all(20),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      TarjetaCita(
                        titulo: "Vacunas",
                        descripcion: "Protege su salud",
                        imagen: "assets/citas1.jpg",
                      ),

                      SizedBox(width: 8,),

                      TarjetaCita(
                        titulo: "Seguimiento de salud",
                        descripcion: "Evaluaciones periódicas",
                        imagen: "assets/citas2.jpg",
                      ),

                      SizedBox(width: 8,),

                      TarjetaCita(
                        titulo: "Cuidado general",
                        descripcion: "Revisión médica básica",
                        imagen: "assets/citas3.jpg",
                      ),

                      SizedBox(width: 8,),

                      TarjetaCita(
                        titulo: "Paseos y actividad",
                        descripcion: "Mantén a tu mascota activa",
                        imagen: "assets/citas4.jpg",
                      ),
                    ],
                  ),
                ),
              ),

              Container(
                padding: EdgeInsets.only(
                  left: 20,
                ),
                child: Text("Tus citas agendadas",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          SizedBox(height: 10,),

          Expanded(
            child: citas.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_busy, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text("No tienes citas agendadas",
                    style: TextStyle(fontSize: 18, color: Colors.grey),
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
                                        child: Text('${cita['fechaProgramada']!}',
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
                                if (value == 'editar') {
                                  Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (x) => ActualizarCita(citaId: cita['id'])
                                      )
                                  ).then((actualizado) {
                                    if (actualizado == true) {
                                      ObtenerCitas();
                                    }
                                  });
                                } else if (value == 'cancelar') {
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
                                              SizedBox(height: 10,)
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
                                                    child: Text("Cancelar",
                                                      style: TextStyle(
                                                        color: Colors.red,
                                                        fontSize: 17,
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ),

                                                Divider(height: 1, color: Colors.grey.withOpacity(0.3)),

                                                InkWell(
                                                  onTap: () => Navigator.pop(context),
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
                                      }
                                  );
                                }
                              },
                              itemBuilder: (context) {
                                return [
                                  PopupMenuItem(
                                      value: 'editar',
                                      child: Row(
                                        children: [
                                          Icon(Icons.event_repeat, size: 18,),
                                          SizedBox(width: 8,),
                                          Text("Reagendar", style: TextStyle(color: Colors.black),)
                                        ],
                                      )
                                  ),
                                  PopupMenuItem(
                                    value: 'cancelar',
                                    child: Row(
                                      children: [
                                        Icon(Icons.cancel, size: 18, color: Colors.red,),
                                        SizedBox(width: 8,),
                                        Text("Cancelar", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold))
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
                            Icon(Icons.pets_outlined, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Paciente: ${cita['mascota']}",
                              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),

                        SizedBox(height: 6),

                        Row(
                          children: [
                            Icon(Icons.person, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Dueño: ${cita['dueño']}",
                              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),

                        Divider(height: 25, thickness: 1),

                        Row(
                          children: [
                            Icon(Icons.healing, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Veterinario: ${cita['veterinario']}",
                              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),

                        SizedBox(height: 6),

                        Row(
                          children: [
                            Icon(Icons.local_hospital, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Clínica: ${cita['clinica']}",
                              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                            ),
                          ],
                        ),

                        SizedBox(height: 6),

                        Row(
                          children: [
                            Icon(Icons.history, size: 22, color: Colors.grey[700]),
                            SizedBox(width: 8),
                            Text("Creada el: ${cita['fechaCreacion']}",
                              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
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

          SizedBox(height: 50,),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(builder: (x) => CrearCita())
          ).then((creada) {
            if (creada == true) {
              ObtenerCitas();
            }
          });
        },
        label: Text("Crear",
          style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold
          ),
        ),
        icon: Image.asset("assets/cita.png",
          width: 30, height: 30,
        ),
        backgroundColor: Colores.azulOscuro,
      ),
    );
  }

  TarjetaCita({required String titulo, required String descripcion, required String imagen}) {
    return Container(
      width: 220,
      margin: EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            child: Image.asset(imagen,
              width: double.infinity, height: 160,
              fit: BoxFit.cover,
            ),
          ),

          Padding(
            padding: EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),

                SizedBox(height: 4),

                Text(
                  descripcion,
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}