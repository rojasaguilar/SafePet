import 'package:flutter/material.dart';
import 'package:safe_pet_client/theme.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';

class CrearCita extends StatefulWidget {
  const CrearCita({super.key});

  @override
  State<CrearCita> createState() => _CrearCitaState();
}

class _CrearCitaState extends State<CrearCita> {
  final fecha = TextEditingController();
  final hora = TextEditingController();

  String? mascotaSeleccionada;
  String? vetSeleccionado;
  String? clinicaSeleccionada;

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

  Future<void> guardarCita() async {
    if (mascotaSeleccionada == null ||
        vetSeleccionado == null ||
        clinicaSeleccionada == null ||
        fecha.text.isEmpty ||
        hora.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Completa todos los campos")),
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

    final url = Uri.parse("${Config.backendUrl}/citas");

    List<String> partesFecha = fecha.text.split('/');
    String fechaISO = "${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}";

    String fechaHoraISO = "${fechaISO}T${hora.text}:00";

    final body = {
      "ui_dueno": user.uid,
      "mascota_id": mascotaSeleccionada,
      "vet_id": vetSeleccionado,
      "clinica_id": clinicaSeleccionada,
      "fechaProgramada": fechaHoraISO,
    };

    try {
      final idToken = await user.getIdToken();
      final resp = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
          'app': 'client-movile',
          'Authorization': 'Bearer $idToken',
        },
        body: jsonEncode(body),
      );

      if (resp.statusCode == 200 || resp.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Cita agendada correctamente"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error al agendar cita"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error de conexión"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text("Nueva Cita", style: TextStyle(fontWeight: FontWeight.bold)),
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
                    Text("Registra una nueva cita",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text("Completa la información básica",
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
                      Text("Mascota a Atender",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colores.azulOscuro,
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: 12,),

                  DropdownButtonFormField<String>(
                    value: mascotaSeleccionada,
                    items: mascotas.map((mascota) {
                      return DropdownMenuItem<String>(
                        value: mascota['mascota_id'] ?? mascota['id'],
                        child: Text(
                            "${mascota['nombre']} - ${mascota['tipo']}"),
                      );
                    }).toList(),
                    onChanged: (v) =>
                        setState(() => mascotaSeleccionada = v),
                    decoration: deco("Mascota", Icons.pets),
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
                      Text("Atención Veterinaria",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colores.azulOscuro,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12,),
                  DropdownButtonFormField<String>(
                    value: clinicaSeleccionada,
                    items: clinicas.map((clinica) {
                      return DropdownMenuItem<String>(
                        value: clinica['clinica_id'] ?? clinica['id'],
                        child: Text("${clinica['nombre']}"),
                      );
                    }).toList(),
                    onChanged: (v) =>
                        setState(() => clinicaSeleccionada = v),
                    decoration: deco("Clínica", Icons.local_hospital),
                  ),

                  SizedBox(height: 20),

                  DropdownButtonFormField<String>(
                    value: vetSeleccionado,
                    items: veterinarios.map((vet) {
                      return DropdownMenuItem<String>(
                        value: vet['uid'],
                        child: Text(
                            "${vet['nombre']} ${vet['apellidos']}"),
                      );
                    }).toList(),
                    onChanged: (v) =>
                        setState(() => vetSeleccionado = v),
                    decoration: deco("Veterinario", Icons.healing),
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
                        .copyWith(
                      suffixIcon: Icon(Icons.calendar_today,
                          color: Colors.black),
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
                        .copyWith(suffixIcon:Icon(Icons.schedule, color: Colors.black),),
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
                            onPressed: guardarCita,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colores.azulPrimario,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.check_circle, color: Colors.white,),
                                SizedBox(width: 6,),
                                Text("Guardar",
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
      ),
    );
  }
}