import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:safe_pet_client/notification_service.dart';
import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/mascotas/actualizarMascota.dart';
import 'package:safe_pet_client/pages/mascotas/crearMascota.dart';
import 'package:safe_pet_client/theme.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:safe_pet_client/pages/mascotas/mascotasCitas.dart';

class PantallaMascotas extends StatefulWidget {
  PantallaMascotas({super.key});
  @override
  _MascotasScreenState createState() => _MascotasScreenState();
}

class _MascotasScreenState extends State<PantallaMascotas> {
  List<Map<String, dynamic>> mascotas = [];
  bool _vibrador = false;
  StreamSubscription? _SubscripcionVibrador;

  final String apiMascotasUrl = "${Config.backendUrl}/mascotas";

  @override
  void initState() {
    super.initState();

    ObtenerMascotas();

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

  Future<void> ObtenerMascotas() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        print("Usuario no autenticado");
        return;
      }

      final idToken = await user.getIdToken();

      final url = Uri.parse(apiMascotasUrl);
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

        setState(() {
          mascotas = data.map<Map<String, dynamic>>((m) {
            String fechaFormateada = '';
            if (m['fechaNacimiento'] != null) {
              try {
                DateTime fecha = DateTime.parse(m['fechaNacimiento']);
                fechaFormateada = "${fecha.day.toString().padLeft(2, '0')}/${fecha.month.toString().padLeft(2, '0')}/${fecha.year}";
              } catch (e) {
                fechaFormateada = m['fechaNacimiento'].toString();
              }
            }

            return {
              'id': m['id'] ?? '',
              'nombre': m['nombre'] ?? '',
              'dueño': m['nombre_dueno'] ?? '',
              'fecha': fechaFormateada,
              'veterinario': m['vet_nombre'] ?? 'Sin asignar',
              'tipo': m['tipo'] ?? '',
              'raza': m['raza'] ?? '',
              'sexo': m['sexo'] ?? '',
              'peso': m['peso']?.toString() ?? '',
            };
          }).toList();
        });
      } else {
        print("Error del servidor: ${response.statusCode}");
      }
    } catch (e) {
      print("Error al conectar con backend: $e");
    }
  }

  void _showEmergencyDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        titlePadding: EdgeInsets.only(top: 20, left: 20, right: 20),
        contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        actionsPadding: EdgeInsets.zero,

        title: Column(
          children: [
            Container(
              padding: EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.emergency, color: Colors.red, size: 50,),
            ),
            SizedBox(height: 15),
            Text('¡Emergencia!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
          ],
        ),

        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Se enviará un mensaje de emergencia al veterinario.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
              ),
            ),
            SizedBox(height: 10),
            Text('¿Deseas continuar?',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ],
        ),

        actions: [
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Divider(height: 1, color: Colors.grey.withOpacity(0.3)),

              InkWell(
                onTap: () {
                  Navigator.of(context).pop();
                  _sendWhatsAppMessage();
                },
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(vertical: 16),
                  alignment: Alignment.center,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.send, color: Colors.red, size: 20),
                      SizedBox(width: 8),
                      Text('Enviar Emergencia',
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              Divider(height: 1, color: Colors.grey.withOpacity(0.3)),

              InkWell(
                onTap: () {
                  Navigator.of(context).pop();
                  setState(() => _vibrador = false);
                },
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(vertical: 16),
                  alignment: Alignment.center,
                  child: Text('Cancelar',
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
      ),
    );
  }

  void _sendWhatsAppMessage() async {
     String Telefono = "+523112558021";
     String Mensaje = "⚠️ EMERGENCIA\n\nMi mascota requiere atención veterinaria urgente. ¿Está disponible para una consulta inmediata?";

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

  Future<void> _eliminarMascota(int index) async {
    final mascotaId = mascotas[index]['id'];

    try {
      final url = Uri.parse("$apiMascotasUrl/$mascotaId");
      final response = await http.delete(url);

      if (response.statusCode == 200 || response.statusCode == 204) {
        final int notificationId = NotificationService.generateUniqueId(mascotaId);
        NotificationService.cancelNotification(notificationId);

        setState(() {
          mascotas.removeAt(index);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Mascota eliminada correctamente")),
        );
      } else {
        print("Error al eliminar: ${response.statusCode}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error al eliminar mascota")),
        );
      }
    } catch (e) {
      print("Error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error de conexión")),
      );
    }
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
                  child: Image.asset("assets/mascotas-principal.jpg",
                    width: double.infinity, height: 200,
                    fit: BoxFit.cover,
                  ),
                ),
                Text("Consulta la información\nde tus mascotas",
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

          Expanded(
            child: mascotas.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.pets, size: 80, color: Colors.grey),
                        SizedBox(height: 16),
                        Text("No tienes mascotas registradas",
                          style: TextStyle(fontSize: 18, color: Colors.grey),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
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
                                                  ActualizarMascota(mascotaId: mascota['id']))
                                      ).then((actualizado) {
                                        if (actualizado == true) {
                                          ObtenerMascotas();
                                        }
                                      });
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
                                                  Text("¿Eliminar mascota?",
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
                                                        _eliminarMascota(index);
                                                      },
                                                      child: Container(
                                                        width: double.infinity,
                                                        padding: EdgeInsets.symmetric(
                                                            vertical: 14),
                                                        alignment: Alignment.center,
                                                        child: Text("Eliminar",
                                                          style: TextStyle(
                                                            color: Colors.red,
                                                            fontSize: 17,
                                                            fontWeight:
                                                                FontWeight.bold,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                    Divider(height: 1, color: Colors.grey.withOpacity(0.3)),
                                                    InkWell(
                                                      onTap: () =>
                                                          Navigator.pop(context),
                                                      child: Container(
                                                        width: double.infinity,
                                                        padding: EdgeInsets.symmetric(
                                                            vertical: 14),
                                                        alignment: Alignment.center,
                                                        child: Text("Cancelar",
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
                                              Icon(Icons.edit, size: 18,),
                                              SizedBox(width: 8,),
                                              Text("Editar",
                                                style: TextStyle(color: Colors.black),
                                              )
                                            ],
                                          )),
                                      PopupMenuItem(
                                        value: 'eliminar',
                                        child: Row(
                                          children: [
                                            Icon(Icons.delete, size: 18, color: Colors.red,),
                                            SizedBox(width: 8,),
                                            Text("Eliminar",
                                                style: TextStyle(
                                                    color: Colors.red,
                                                    fontWeight: FontWeight.bold
                                                )
                                            )
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
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.pets_outlined, size: 22, color: Colors.grey[700]),
                                    SizedBox(width: 8),
                                    Text("Raza: ${mascota['raza']}",
                                      style: TextStyle(
                                          fontSize: 16, color: Colors.grey[800]),
                                    ),
                                  ],
                                ),

                                Row(
                                  children: [
                                    Icon(Icons.category, size: 22, color: Colors.grey[700]),
                                    SizedBox(width: 8),
                                    Text("Tipo: ${mascota['tipo']}",
                                      style: TextStyle(
                                          fontSize: 16, color: Colors.grey[800]),
                                    ),
                                  ],
                                ),
                              ],
                            ),

                            SizedBox(height: 6),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.male, size: 22, color: Colors.grey[700]),
                                    SizedBox(width: 8),
                                    Text("Sexo: ${mascota['sexo']}",
                                      style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                                    ),
                                  ],
                                ),

                                Row(
                                  children: [
                                    Icon(Icons.monitor_weight, size: 22, color: Colors.grey[700]),
                                    SizedBox(width: 8),
                                    Text("Peso: ${mascota['peso']}",
                                      style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                                    ),
                                  ],
                                ),
                              ],
                            ),

                            Divider(height: 25, thickness: 1),

                            Row(
                              children: [
                                Icon(Icons.person, size: 22, color: Colors.grey[700]),
                                SizedBox(width: 8),
                                Text("Dueño: ${mascota['dueño']}",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.grey[800]),
                                ),
                              ],
                            ),
                            SizedBox(height: 6),
                            Row(
                              children: [
                                Icon(Icons.calendar_today, size: 22, color: Colors.grey[700]),
                                SizedBox(width: 8),
                                Text("Nacimiento: ${mascota['fecha']}",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.grey[800]),
                                ),
                              ],
                            ),
                            SizedBox(height: 6),
                            Row(
                              children: [
                                Icon(Icons.local_hospital, size: 22, color: Colors.grey[700]),
                                SizedBox(width: 8),
                                Text("Veterinario: ${mascota['veterinario']}",
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
                                    onPressed: () {
                                      Navigator.push(context, MaterialPageRoute(builder: (x) => MascotasCitas(
                                        mascotaId: mascota['id'],
                                        nombreMascota: mascota['nombre'],
                                      )));
                                    },
                                    icon: Icon(Icons.calendar_month, color: Colors.white,),
                                    label: Text("Citas",
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

          SizedBox(height: 50,),
      ],
    ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (x) => crearmascota()),
          ).then((creada) {
            if (creada == true) {
              ObtenerMascotas();
            }
          });
        },
        label: Text("Crear",
          style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold
          ),
        ),
        icon: Image.asset("assets/dog.png",
          width: 30, height: 30,
        ),
        backgroundColor: Colores.azulOscuro,
      ),
    );
  }
}
