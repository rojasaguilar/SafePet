import 'package:flutter/material.dart';
import 'package:safe_pet_client/theme.dart';

class ActualizarMascota extends StatefulWidget {
  const ActualizarMascota({super.key});

  @override
  State<ActualizarMascota> createState() => _ActualizarMascotaState();
}

class _ActualizarMascotaState extends State<ActualizarMascota> {
  final nombre = TextEditingController();
  final raza = TextEditingController();
  final fecha = TextEditingController();

  int? duenoSeleccionado;
  String? tipoSeleccionado;
  int? vetSeleccionado;

  InputDecoration deco(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(
          color: Colors.black
      ),
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
          title: Text("Actualizar Mascota", style: TextStyle(fontWeight: FontWeight.bold)),
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
                        DropdownMenuItem(value: "Gato", child: Text("Gato")),
                        DropdownMenuItem(value: "Perro", child: Text("Perro")),
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

                    TextField(
                      controller: fecha,
                      readOnly: true,
                      decoration: deco("Fecha de nacimiento", Icons.cake).copyWith(
                        suffixIcon: Icon(Icons.calendar_today, color: Colors.black),
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
                                    onPrimary: Colors.white
                                ),

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
                          fecha.text = "${f.day.toString().padLeft(2, '0')}/${f.month.toString().padLeft(2, '0')}/${f.year}";
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

                    DropdownButtonFormField<int>(
                      value: vetSeleccionado,
                      items: [
                        DropdownMenuItem(value: 1, child: Text("Clínica PetCare")),
                        DropdownMenuItem(value: 2, child: Text("Veterinaria Central")),
                      ],
                      onChanged: (v) => setState(() => vetSeleccionado = v),
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
                              onPressed: () {},
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