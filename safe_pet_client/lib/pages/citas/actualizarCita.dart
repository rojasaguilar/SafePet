import 'package:flutter/material.dart';
import 'package:safe_pet_client/theme.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ActualizarCita extends StatefulWidget {
  final String citaId;
  const ActualizarCita({super.key, required this.citaId});

  @override
  State<ActualizarCita> createState() => _ActualizarCitaState();
}

class _ActualizarCitaState extends State<ActualizarCita> {
  final fecha = TextEditingController();
  final hora = TextEditingController();
  final motivo = TextEditingController();
  final notas = TextEditingController();

  String? mascotaSeleccionada;
  String? vetSeleccionado;
  String? clinicaSeleccionada;
  String? asistenciaSeleccionada;

  List<Map<String, dynamic>> mascotas = [];
  List<Map<String, dynamic>> veterinarios = [];
  List<Map<String, dynamic>> clinicas = [];

  @override
  void initState() {
    super.initState();
    cargarDatos();
  }

  Future<void> cargarDatos() async {
    await Future.wait([
      cargarMascotas(),
      cargarVeterinarios(),
      cargarClinicas(),
      cargarCita(),
    ]);
  }

  Future<void> cargarMascotas() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      final idToken = await user.getIdToken();
      final url = Uri.parse("${Config.backendUrl}/mascotas");
      final resp = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
      );

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        setState(() {
          mascotas = List<Map<String, dynamic>>.from(data['data']);
        });
      }
    } catch (e) {
      print("Error cargando mascotas: $e");
    }
  }

  Future<void> cargarVeterinarios() async {
    try {
      final url = Uri.parse("${Config.backendUrl}/usuarios?rol=veterinario");
      final resp = await http.get(url);

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        setState(() {
          veterinarios = List<Map<String, dynamic>>.from(data['data']);
        });
      }
    } catch (e) {
      print("Error cargando veterinarios: $e");
    }
  }

  Future<void> cargarClinicas() async {
    try {
      final url = Uri.parse("${Config.backendUrl}/clinicas");
      final resp = await http.get(url);

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        setState(() {
          clinicas = List<Map<String, dynamic>>.from(data['data']);
        });
      }
    } catch (e) {
      print("Error cargando clínicas: $e");
    }
  }

  Future<void> cargarCita() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      final idToken = await user.getIdToken();
      final url = Uri.parse("${Config.backendUrl}/citas/${widget.citaId}");
      final resp = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
      );

      print("Status cargar cita: ${resp.statusCode}");
      print("Response: ${resp.body}");

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final cita = data['data'];

        String fechaFormateada = '';
        String horaFormateada = '';

        if (cita['fechaProgramada'] != null) {
          if (cita['fechaProgramada'] is Map && cita['fechaProgramada']['_seconds'] != null) {
            int seconds = cita['fechaProgramada']['_seconds'];
            DateTime fechaObj = DateTime.fromMillisecondsSinceEpoch(seconds * 1000);
            fechaFormateada = "${fechaObj.day.toString().padLeft(2, '0')}/${fechaObj.month.toString().padLeft(2, '0')}/${fechaObj.year}";
            horaFormateada = "${fechaObj.hour.toString().padLeft(2, '0')}:${fechaObj.minute.toString().padLeft(2, '0')}";
          }
          else if (cita['fechaProgramada'] is String) {
            try {
              DateTime fechaObj = DateTime.parse(cita['fechaProgramada']);
              fechaFormateada = "${fechaObj.day.toString().padLeft(2, '0')}/${fechaObj.month.toString().padLeft(2, '0')}/${fechaObj.year}";
              horaFormateada = "${fechaObj.hour.toString().padLeft(2, '0')}:${fechaObj.minute.toString().padLeft(2, '0')}";
            } catch (e) {
              print("Error parseando fecha: $e");
            }
          }
        }

        String? mascotaId;
        if (cita['mascota_id'] != null) {
          if (cita['mascota_id'] is String) {
            mascotaId = cita['mascota_id'];
          } else if (cita['mascota_id'] is Map) {
            mascotaId = cita['mascota_id']['id'];
          }
        }

        String? vetId;
        if (cita['vet_id'] != null) {
          if (cita['vet_id'] is String) {
            vetId = cita['vet_id'];
          } else if (cita['vet_id'] is Map) {
            vetId = cita['vet_id']['id'];
          }
        }

        String? clinicaId;
        if (cita['clinica_id'] != null) {
          if (cita['clinica_id'] is String) {
            clinicaId = cita['clinica_id'];
          } else if (cita['clinica_id'] is Map) {
            clinicaId = cita['clinica_id']['id'];
          }
        }

        setState(() {
          fecha.text = fechaFormateada;
          hora.text = horaFormateada;
          motivo.text = cita['motivo'] ?? '';
          notas.text = cita['notas'] ?? '';
          mascotaSeleccionada = mascotaId;
          vetSeleccionado = vetId;
          clinicaSeleccionada = clinicaId;
          asistenciaSeleccionada = cita['asistencia'] ?? 'pendiente';
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al cargar cita")),
        );
      }
    } catch (e) {
      print("Error cargando cita: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión: $e")),
      );
    }
  }

  Future<void> actualizarCita() async {
    if (fecha.text.isEmpty || hora.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("La fecha y hora son obligatorias")),
      );
      return;
    }

    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Usuario no autenticado")),
      );
      return;
    }

    final url = Uri.parse("${Config.backendUrl}/citas/${widget.citaId}");

    List<String> partesFecha = fecha.text.split('/');
    String fechaISO = "${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}";

    String fechaHoraISO = "${fechaISO}T${hora.text}:00";

    final body = {
      "fechaProgramada": fechaHoraISO,
      "asistencia": asistenciaSeleccionada,
      "motivo": motivo.text,
      "notas": notas.text,
    };

    try {
      final idToken = await user.getIdToken();
      final resp = await http.patch(
        url,
        headers: {
          "Content-Type": "application/json",
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
        body: jsonEncode(body),
      );

      if (resp.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Cita actualizada correctamente"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error al actualizar cita"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      print("Excepción: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error de conexión"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  InputDecoration deco(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: Colors.black),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      prefixIcon: Icon(icon, color: Colors.black87),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: AppBar(
          title: Text("Actualizar Cita", style: TextStyle(fontWeight: FontWeight.bold)),
          centerTitle: true,
          backgroundColor: Colors.white,
          foregroundColor: Colores.azulOscuro,
        ),
        body: ListView(
          padding: EdgeInsets.all(20),
          children: [
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colores.azulPrimario,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Container(
                    child: Icon(Icons.date_range_sharp, color: Colors.white, size: 32),
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),

                  SizedBox(width: 16,),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Actualiza la información",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text("Modifica los detalles necesarios",
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.9),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),

            SizedBox(height: 20,),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 4, height: 20,
                          decoration: BoxDecoration(
                            color: Colores.azulPrimario,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        SizedBox(width: 8),
                        Text("Programación de la Cita",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colores.azulOscuro,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12,),
                    TextField(
                      controller: fecha,
                      readOnly: true,
                      decoration:
                      deco("Fecha de cita", Icons.calendar_month)
                          .copyWith(suffixIcon: Icon(Icons.calendar_today, color: Colors.black),
                      ),
                      onTap: () async {
                        DateTime? f = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate: DateTime(2030),
                          builder: (context, child) {
                            return Theme(
                              data: Theme.of(context).copyWith(
                                colorScheme: ColorScheme.light(
                                    primary: Colores.azulPrimario,
                                    onPrimary: Colors.white
                                ),
                                textButtonTheme: TextButtonThemeData(
                                  style: TextButton.styleFrom(
                                    foregroundColor:
                                    Colores.azulPrimario,
                                  ),
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );

                        if (f != null) {
                          fecha.text =
                          "${f.day.toString().padLeft(2, '0')}/${f.month.toString().padLeft(2, '0')}/${f.year}";
                        }
                      },
                    ),

                    SizedBox(height: 20),

                    TextField(
                      controller: hora,
                      readOnly: true,
                      decoration: deco("Hora de cita", Icons.access_time)
                          .copyWith(
                        suffixIcon:
                        Icon(Icons.schedule, color: Colors.black),
                      ),
                      onTap: () async {
                        TimeOfDay? t = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay.now(),
                          builder: (context, child) {
                            return Theme(
                              data: Theme.of(context).copyWith(
                                colorScheme: ColorScheme.light(
                                    primary: Colores.azulPrimario,
                                    onPrimary: Colors.white),
                                textButtonTheme: TextButtonThemeData(
                                  style: TextButton.styleFrom(
                                    foregroundColor:
                                    Colores.azulPrimario,
                                  ),
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );

                        if (t != null) {
                          hora.text =
                          "${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}";
                        }
                      },
                    ),
                    SizedBox(height: 20),
                    Row(
                      children: [
                        Container(
                          width: 4, height: 20,
                          decoration: BoxDecoration(
                            color: Colores.azulPrimario,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        SizedBox(width: 8),
                        Text("Estado y Detalles",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colores.azulOscuro,
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 12),

                    DropdownButtonFormField<String>(
                      value: asistenciaSeleccionada,
                      items: [
                        DropdownMenuItem(value: "pendiente", child: Text("Pendiente")),
                        DropdownMenuItem(value: "confirmada", child: Text("Confirmada")),
                        DropdownMenuItem(value: "completada", child: Text("Completada")),
                        DropdownMenuItem(value: "cancelada", child: Text("Cancelada")),
                      ],
                      onChanged: (v) =>
                          setState(() => asistenciaSeleccionada = v),
                      decoration: deco("Estado", Icons.event_available),
                    ),

                    SizedBox(height: 20),

                    TextField(
                      controller: motivo,
                      decoration: deco("Motivo de la cita", Icons.notes),
                      maxLines: 2,
                    ),

                    SizedBox(height: 20),

                    TextField(
                      controller: notas,
                      decoration:
                      deco("Notas adicionales", Icons.note_add),
                      maxLines: 3,
                    ),

                    SizedBox(height: 20),

                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(color: Colors.grey),
                              ),
                              child: Text("Cancelar",
                                  style: TextStyle(
                                      color: Colors.black87,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1
                                  )
                              )
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: ElevatedButton(
                              onPressed: actualizarCita,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colores.azulPrimario,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.autorenew, color: Colors.white,),
                                  SizedBox(width: 6,),
                                  Text("Actualizar",
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          letterSpacing: 1
                                      )
                                  ),
                                ],
                              )
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            SizedBox(height: 30,),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.pets, size: 20,),
                SizedBox(width: 8,),
                Text("SafePet",
                  style: TextStyle(
                    color: Colores.azulOscuro,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                )
              ],
            ),
          ],
        )
    );
  }
}