import 'package:flutter/material.dart';

class PantallaMascotas extends StatefulWidget {
  PantallaMascotas({super.key});
  @override
  _MascotasScreenState createState() => _MascotasScreenState();
}

class _MascotasScreenState extends State<PantallaMascotas> {

  List<Map<String, String>> mascotas = [];
  @override
  void initState() {
    super.initState();

    mascotas = [
      {'nombre': 'Olaf', 'veterinario': 'Grapas'},
      {'nombre': 'Arena', 'veterinario': 'Grapas'},
      {'nombre': 'Megacable Vato', 'veterinario': 'Grapas'},
    ];
  }
 //borrar
  void _eliminarMascota(int index) {
    setState(() {
      mascotas.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mascotas"),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: mascotas.length,
        itemBuilder: (context, index) {
          final mascota = mascotas[index];
          return Card(
            margin: EdgeInsets.all(8.0),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    title: Text(mascota['nombre']!),
                    subtitle: Text('Veterinario: ${mascota['veterinario']}'),
                    trailing: PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'editar') {
                          // TODO: Implementar edición
                        } else if (value == 'eliminar') {
                          _eliminarMascota(index);
                        }
                      },
                      itemBuilder: (BuildContext context) {
                        return {'Editar', 'Eliminar'}.map((String choice) {
                          return PopupMenuItem<String>(
                            value: choice.toLowerCase(),
                            child: Text(choice),
                          );
                        }).toList();
                      },
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                        },
                        child: Text('Consultar Citas'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                        },
                        child: Text('Agendar Cita'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
