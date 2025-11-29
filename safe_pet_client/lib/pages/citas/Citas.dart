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
  List<Map<String, String>> citas = [];

  @override
  void initState() {
    super.initState();
    citas = [
      {
        'mascota': 'Olaf',
        'dueño': 'chuy',
        'veterinario': 'grapas',
        'clinica': 'moctezuma',
        'fechaProgramada': '29/11/2025',
        'asistencia': 'Pendiente',
        'fechaCreacion': '2024-10-26 10:00 AM',
      },
      {
        'mascota': 'Arena',
        'dueño': 'rojas',
        'veterinario': 'grapas',
        'clinica': 'moctezuma',
        'fechaProgramada': '29/11/2025',
        'asistencia': 'Pendiente',
        'fechaCreacion': '2024-10-26 10:00 AM'
      },
      {
        'mascota': 'Megacable Vato',
        'dueño': 'gallaga',
        'veterinario': 'grapas',
        'clinica': 'moctezuma',
        'fechaProgramada': '29/11/2025',
        'asistencia': 'Pendiente',
        'fechaCreacion': '2024-10-26 10:00 AM'
      },
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
      body: Column(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.only(
                  top: 10,
                  left: 20,
                ),
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
            child: ListView.builder(
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
                            Row(
                              children: [
                                Icon(Icons.event_available, color: Colors.blueAccent, size: 30),
                                SizedBox(width: 10),
                                Text('Cita para el: ${cita['fechaProgramada']!}',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                              ],
                            ),

                            PopupMenuButton<String>(
                              onSelected: (value) {
                                if (value == 'editar') {
                                  Navigator.push(context, MaterialPageRoute(builder: (x) => ActualizarCita()));
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
                                                    _cancelarCita(index);
                                                    Navigator.pop(context);
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
                                          Icon(Icons.edit, size: 18,),
                                          SizedBox(width: 8,),
                                          Text("Editar", style: TextStyle(color: Colors.black),)
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

                        SizedBox(height: 6),

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
          Navigator.push(context, MaterialPageRoute(builder: (x) => CrearCita()));
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