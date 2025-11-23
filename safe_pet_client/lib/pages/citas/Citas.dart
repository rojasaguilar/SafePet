import 'package:flutter/material.dart';

class PantallaCitas extends StatefulWidget {
  PantallaCitas({super.key});

  @override
  _CitasScreenState createState() => _CitasScreenState();
}

class _CitasScreenState extends State<PantallaCitas> {
  List<Map<String, String>> citas = [];

  @override
  void initState() {
    super.initState();
    citas = [
      {'mascota': 'Olaf', 'fecha': '2024-10-26 10:00 AM', 'veterinario': 'grapas'},
      {'mascota': 'Arena', 'fecha': '2024-10-27 11:00 AM', 'veterinario': 'grapas'},
      {'mascota': 'Megacable Vato', 'fecha': '2024-10-26 02:00 PM', 'veterinario': 'grapas'},
    ];
  }
 //cancelar
  void _cancelarCita(int index) {
    setState(() {
      citas.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        itemCount: citas.length,
        itemBuilder: (context, index) {
          final cita = citas[index];
          return Card(
            margin: EdgeInsets.all(8.0),
            child: ListTile(
              title: Text('Cita para ${cita['mascota']}'),
              subtitle: Text('Fecha: ${cita['fecha']}\nVeterinario: ${cita['veterinario']}'),
              trailing: PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'reagendar') {

                  } else if (value == 'cancelar') {
                    _cancelarCita(index);
                  }
                },
                itemBuilder: (BuildContext context) {
                  return {'Reagendar', 'Cancelar'}.map((String choice) {
                    return PopupMenuItem<String>(
                      value: choice.toLowerCase(),
                      child: Text(choice),
                    );
                  }).toList();
                },
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: Icon(Icons.add),
        tooltip: 'Agendar Cita',
      ),
    );
  }
}
