import 'dart:async';

import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/mascotas/mascotas_crear_editar.dart';
import 'package:safe_pet_client/theme.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class PantallaMascotas extends StatefulWidget {
  PantallaMascotas({super.key});
  @override
  _MascotasScreenState createState() => _MascotasScreenState();
}

class _MascotasScreenState extends State<PantallaMascotas> {
  List<Map<String, String>> mascotas = [];
  bool _vibrador = false;
  StreamSubscription? _SubscripcionVibrador;

  @override
  void initState() {
    super.initState();

    mascotas = [
      {
        'nombre': 'Olaf',
        'dueño': 'chuy',
        'fecha': '21/02/2021',
        'veterinario': 'grapas',
        'tipo': 'Perro',
        'raza': 'Pastor Alemán'
      },
      {
        'nombre': 'Arena',
        'dueño': 'rojas',
        'fecha': '21/02/2021',
        'veterinario': 'Grapas',
        'tipo': 'Gato',
        'raza': 'Naranja'
      },
      {
        'nombre': 'Megacable Vato',
        'dueño': 'gallaga',
        'fecha': '21/02/2021',
        'veterinario': 'Grapas',
        'tipo': 'Perro',
        'raza': 'Chihuahua'
      },
    ];

    _SubscripcionVibrador = accelerometerEvents.listen((AccelerometerEvent event) {
      if (!mounted) return;
      final double x = event.x.abs();
      final double y = event.y.abs();
      final double z = event.z.abs();
      if ((x > 30 || y > 30 || z > 30) && !_vibrador) {
        setState(() => _vibrador = true);
        _showEmergencyDialog();
      }
    });
  }

  void _showEmergencyDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('¡Emergencia!'),
        content:
            Text('Se enviará un mensaje de emergencia al veterinario. ¿Deseas continuar?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() => _vibrador = false);
            },
            child: Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _sendWhatsAppMessage();
            },
            child: Text('Enviar'),
          ),

        ],
      ),

    );
  }

  void _sendWhatsAppMessage() async {
     String Telefono = "+523112558021";
     String Mensaje = "Tengo una emergencia con mi mascota vato.";

    final Uri url = Uri.parse(
        "https://wa.me/$Telefono?text=${Uri.encodeComponent(Mensaje)}"
    );
    if (await canLaunchUrl(url)) {
      print(Mensaje);
      await launchUrl(
        url,
        mode: LaunchMode.externalApplication,
      );

    } else {
      ScaffoldMessenger.of(context).showSnackBar(
         SnackBar(content: Text('No se pudo abrir WhatsApp')),
      );
    }
    setState(() => _vibrador = false);
  }

  //borrar
  void _eliminarMascota(int index) {
    setState(() {
      mascotas.removeAt(index);
    });
  }

  @override
  void dispose() {
    _SubscripcionVibrador?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
      children: [
        Container(
          padding: EdgeInsets.all(5),
          width: double.infinity,
          child: Stack(
            alignment: Alignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  "assets/mascotas-principal.jpg",
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                ),
              ),
              Text(
                "Consulta la información de tus mascotas",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      blurRadius: 8,
                      color: Colors.black54,
                      offset: Offset(2, 2),
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        SizedBox(
          height: 10,
        ),
        FilledButton(
          onPressed: () {
            Navigator.push(context,
                MaterialPageRoute(builder: (x) => mascotas_crear_editar()));
          },
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.add,
              ),
              SizedBox(
                width: 6,
              ),
              Text(
                "Agregar Mascota",
                style: TextStyle(fontWeight: FontWeight.bold),
              )
            ],
          ),
          style: FilledButton.styleFrom(backgroundColor: Colors.black),
        ),
        SizedBox(
          height: 10,
        ),
        Expanded(
          child: ListView.builder(
            itemCount: mascotas.length,
            itemBuilder: (context, index) {
              final mascota = mascotas[index];
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
                              Icon(Icons.pets,
                                  color: Colors.blueAccent, size: 30),
                              SizedBox(width: 10),
                              Text(
                                mascota['nombre']!,
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                          PopupMenuButton<String>(
                            onSelected: (value) {
                              if (value == 'editar') {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (x) =>
                                            mascotas_crear_editar()));
                              } else if (value == 'eliminar') {
                                showDialog(
                                    context: context,
                                    builder: (x) {
                                      return AlertDialog(
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(20),
                                        ),
                                        titlePadding: EdgeInsets.only(
                                            top: 20, left: 20, right: 20),
                                        contentPadding: EdgeInsets.zero,
                                        actionsPadding: EdgeInsets.zero,
                                        title: Column(
                                          children: [
                                            Icon(Icons.warning_amber_rounded,
                                                color: Colors.red, size: 48),
                                            SizedBox(height: 10),
                                            Text(
                                              "¿Eliminar mascota?",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            SizedBox(height: 8),
                                            Text(
                                              "Esta acción no se puede deshacer.",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 15,
                                                color: Colors.black54,
                                              ),
                                            ),
                                            SizedBox(
                                              height: 10,
                                            )
                                          ],
                                        ),
                                        actions: [
                                          Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Divider(
                                                  height: 1,
                                                  color: Colors.grey
                                                      .withOpacity(0.3)),
                                              InkWell(
                                                onTap: () {
                                                  _eliminarMascota(index);
                                                  Navigator.pop(context);
                                                },
                                                child: Container(
                                                  width: double.infinity,
                                                  padding: EdgeInsets.symmetric(
                                                      vertical: 14),
                                                  alignment: Alignment.center,
                                                  child: Text(
                                                    "Eliminar",
                                                    style: TextStyle(
                                                      color: Colors.red,
                                                      fontSize: 17,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Divider(
                                                  height: 1,
                                                  color: Colors.grey
                                                      .withOpacity(0.3)),
                                              InkWell(
                                                onTap: () =>
                                                    Navigator.pop(context),
                                                child: Container(
                                                  width: double.infinity,
                                                  padding: EdgeInsets.symmetric(
                                                      vertical: 14),
                                                  alignment: Alignment.center,
                                                  child: Text(
                                                    "Cancelar",
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
                                    });
                              }
                            },
                            itemBuilder: (context) {
                              return [
                                PopupMenuItem(
                                    value: 'editar',
                                    child: Row(
                                      children: [
                                        Icon(
                                          Icons.edit,
                                          size: 18,
                                        ),
                                        SizedBox(
                                          width: 8,
                                        ),
                                        Text(
                                          "Editar",
                                          style: TextStyle(color: Colors.black),
                                        )
                                      ],
                                    )),
                                PopupMenuItem(
                                  value: 'eliminar',
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.delete,
                                        size: 18,
                                        color: Colors.red,
                                      ),
                                      SizedBox(
                                        width: 8,
                                      ),
                                      Text("Eliminar",
                                          style: TextStyle(
                                              color: Colors.red,
                                              fontWeight: FontWeight.bold))
                                    ],
                                  ),
                                ),
                              ];
                            },
                          ),
                        ],
                      ),
                      Divider(height: 25, thickness: 1),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.category,
                                  size: 22, color: Colors.grey[700]),
                              SizedBox(width: 8),
                              Text(
                                "Tipo: ${mascota['tipo']}",
                                style: TextStyle(
                                    fontSize: 16, color: Colors.grey[800]),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              Icon(Icons.pets_outlined,
                                  size: 22, color: Colors.grey[700]),
                              SizedBox(width: 8),
                              Text(
                                "Raza: ${mascota['raza']}",
                                style: TextStyle(
                                    fontSize: 16, color: Colors.grey[800]),
                              ),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(Icons.person, size: 22, color: Colors.grey[700]),
                          SizedBox(width: 8),
                          Text(
                            "Dueño: ${mascota['dueño']}",
                            style: TextStyle(
                                fontSize: 16, color: Colors.grey[800]),
                          ),
                        ],
                      ),
                      SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(Icons.calendar_today,
                              size: 22, color: Colors.grey[700]),
                          SizedBox(width: 8),
                          Text(
                            "Nacimiento: ${mascota['fecha']}",
                            style: TextStyle(
                                fontSize: 16, color: Colors.grey[800]),
                          ),
                        ],
                      ),
                      SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(Icons.local_hospital,
                              size: 22, color: Colors.grey[700]),
                          SizedBox(width: 8),
                          Text(
                            "Veterinario: ${mascota['veterinario']}",
                            style: TextStyle(
                                fontSize: 16, color: Colors.grey[800]),
                          ),
                        ],
                      ),
                      SizedBox(height: 18),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () {},
                              icon: Icon(
                                Icons.calendar_month,
                                color: Colors.white,
                              ),
                              label: Text(
                                "Citas",
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.grey.shade500,
                                padding: EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () {},
                              icon: Icon(
                                Icons.add,
                                color: Colors.white,
                              ),
                              label: Text(
                                "Agendar",
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colores.azulPrimario,
                                padding: EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ));
  }
}
