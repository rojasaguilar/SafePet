import 'package:flutter/material.dart';
import 'package:safe_pet_client/theme.dart';

class mascotas_crear_editar extends StatefulWidget {
  const mascotas_crear_editar({super.key});

  @override
  State<mascotas_crear_editar> createState() => _mascotas_crear_editarState();
}

class _mascotas_crear_editarState extends State<mascotas_crear_editar> {
  final mascotaId = TextEditingController(text: "123");
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
        borderSide: BorderSide(color: Colores.azulSecundario, width: 2),
      ),
      prefixIcon: Icon(icon, color: Colors.black),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text("Datos de la Mascota", style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colores.azulPrimario,
        foregroundColor: Colors.white,
      ),

      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    TextField(
                      controller: mascotaId,
                      enabled: false,
                      style: TextStyle(color: Colors.black),
                      decoration: deco("ID Mascota", Icons.tag),
                    ),

                    SizedBox(height: 20),

                    DropdownButtonFormField<int>(
                      value: duenoSeleccionado,
                      items: [
                        DropdownMenuItem(value: 1, child: Text("Gallaga")),
                        DropdownMenuItem(value: 2, child: Text("Chuy")),
                        DropdownMenuItem(value: 3, child: Text("Rojas")),
                      ],
                      onChanged: (v) => setState(() => duenoSeleccionado = v),
                      decoration: deco("Dueño", Icons.person),
                    ),

                    SizedBox(height: 20),

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
                        );
                        if (f != null) {
                          fecha.text = "${f.day.toString().padLeft(2, '0')}/${f.month.toString().padLeft(2, '0')}/${f.year}";
                        }
                      },
                    ),

                    SizedBox(height: 20),

                    DropdownButtonFormField<int>(
                      value: vetSeleccionado,
                      items: [
                        DropdownMenuItem(value: 1, child: Text("Clínica PetCare")),
                        DropdownMenuItem(value: 2, child: Text("Veterinaria Central")),
                      ],
                      onChanged: (v) => setState(() => vetSeleccionado = v),
                      decoration: deco("Veterinario", Icons.local_hospital),
                    ),

                    SizedBox(height: 30),

                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pop(context),
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colores.azulPrimario),
                            ),
                            child: Text("Cancelar", style: TextStyle(color: Colores.azulPrimario)),
                          ),
                        ),

                        SizedBox(width: 16),

                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colores.azulPrimario,
                            ),
                            child: Text("Guardar", style: TextStyle(color: Colors.white)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            Spacer(),
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
            )
          ],
        ),
      ),
    );
  }
}
