import 'package:flutter/material.dart';
import 'package:safe_pet_client/theme.dart';
import 'package:safe_pet_client/notification_service.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';

class crearmascota extends StatefulWidget {
  const crearmascota({super.key});

  @override
  State<crearmascota> createState() => _crearmascotaState();
}

class _crearmascotaState extends State<crearmascota> {
  final nombre = TextEditingController();
  final raza = TextEditingController();
  final fecha = TextEditingController();
  final peso = TextEditingController();

  String? tipoSeleccionado;
  String? sexoSeleccionado;
  String? vetSeleccionado;

  List<Map<String, dynamic>> veterinarios = [];

  @override
  void initState() {
    super.initState();
    cargarVeterinarios();
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
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al cargar veterinarios")),
        );
      }
    } catch (e) {
      print("Error cargando veterinarios: $e");
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

  Future<void> guardarMascota() async {
    if (nombre.text.isEmpty ||
        raza.text.isEmpty ||
        peso.text.isEmpty ||
        fecha.text.isEmpty ||
        tipoSeleccionado == null ||
        sexoSeleccionado == null ||
        vetSeleccionado == null) {
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

    final url = Uri.parse("${Config.backendUrl}/mascotas");

    List<String> partesFecha = fecha.text.split('/');
    String fechaISO = "${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}";

    final body = {
      "ui_dueno": user.uid,
      "nombre": nombre.text,
      "raza": raza.text,
      "tipo": tipoSeleccionado,
      "sexo": sexoSeleccionado,
      "peso": peso.text,
      "fechaNacimiento": fechaISO,
      "vet_id": vetSeleccionado,
    };

    try {
      final resp = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      if (resp.statusCode == 200 || resp.statusCode == 201) {
        final bodyResponse = jsonDecode(resp.body);
        final String mascotaId = bodyResponse['data']['id'];

        final DateTime fechaNacimiento = DateTime.parse(fechaISO);

        if (tipoSeleccionado == "Perro" || tipoSeleccionado == "Gato") {
          final int notificationId = NotificationService.generateUniqueId(mascotaId);

          NotificationService.scheduleBirthdayNotification(
            id: notificationId,
            petName: nombre.text,
            birthday: fechaNacimiento,
          );
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Mascota registrada correctamente")),
        );
        Navigator.pop(context, true);
      } else {
        print("Error ${resp.statusCode}: ${resp.body}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al guardar mascota")),
        );
      }
    } catch (e) {
      print("Excepción: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: AppBar(
          title: Text("Nueva Mascota", style: TextStyle(fontWeight: FontWeight.bold)),
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
                    child: Icon(Icons.pets, color: Colors.white, size: 32),
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
                      Text("Registra tu mascota",
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
                        Text("Datos de la Mascota",
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
                      controller: nombre,
                      decoration: deco("Nombre de la mascota", Icons.pets),
                    ),

                    SizedBox(height: 20),

                    DropdownButtonFormField<String>(
                      value: tipoSeleccionado,
                      items: [
                        DropdownMenuItem(value: "Perro", child: Text("Perro")),
                        DropdownMenuItem(value: "Gato", child: Text("Gato")),
                      ],
                      onChanged: (v) => setState(() => tipoSeleccionado = v),
                      decoration: deco("Tipo", Icons.category),
                    ),

                    SizedBox(height: 20),

                    TextField(
                      controller: raza,
                      decoration: deco("Raza", Icons.info_outline),
                    ),

                    SizedBox(height: 20),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: TextField(
                            controller: peso,
                            decoration: deco("Peso", Icons.monitor_weight),
                            keyboardType: TextInputType.number,
                          ),
                        ),
                        SizedBox(width: 10,),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: sexoSeleccionado,
                            items: [
                              DropdownMenuItem(value: "Macho", child: Text("Macho")),
                              DropdownMenuItem(value: "Hembra", child: Text("Hembra")),
                            ],
                            onChanged: (v) => setState(() => sexoSeleccionado = v),
                            decoration: deco("Sexo", Icons.male),
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 20),

                    TextField(
                      controller: fecha,
                      readOnly: true,
                      decoration: deco("Fecha de nacimiento", Icons.cake)
                          .copyWith(
                        suffixIcon:
                        Icon(Icons.calendar_today, color: Colors.black),
                      ),
                      onTap: () async {
                        DateTime? f = await showDatePicker(
                          context: context,
                          initialDate: DateTime(2020),
                          firstDate: DateTime(2000),
                          lastDate: DateTime.now(),
                          builder: (context, child) {
                            return Theme(
                              data: Theme.of(context).copyWith(
                                colorScheme: ColorScheme.light(
                                    primary: Colores.azulPrimario,
                                    onPrimary: Colors.white),
                                textButtonTheme: TextButtonThemeData(
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colores.azulPrimario,
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
                      value: vetSeleccionado,
                      items: veterinarios.map((vet) {
                        return DropdownMenuItem<String>(
                          value: vet['uid'],
                          child: Text("${vet['nombre']} ${vet['apellidos']}"),
                        );
                      }).toList(),
                      onChanged: (v) =>
                          setState(() => vetSeleccionado = v),
                      decoration: deco("Veterinario", Icons.local_hospital),
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
                              onPressed: guardarMascota,
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
                              )),
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