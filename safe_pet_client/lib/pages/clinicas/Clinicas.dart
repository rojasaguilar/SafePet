import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:safe_pet_client/theme.dart';

class PantallaClinicas extends StatefulWidget {
   PantallaClinicas({super.key});

  @override
  State<PantallaClinicas> createState() => _PantallaClinicasState();
}

class _PantallaClinicasState extends State<PantallaClinicas> {
  static  LatLng _CentroMapa = LatLng(21.5082, -104.8969);
  String? _clinicaSeleccionada;

  static CameraPosition _PosicionCamara = CameraPosition(
    target: _CentroMapa,
    zoom: 14.0,
  );

  final List<Map<String, dynamic>> _clinicas = [
    {
      'id': 'clinica1',
      'nombre': 'Clínica Veterinaria Los Cuates',
      'direccion': 'Av. Insurgentes 123',
      'telefono': '311-123-4567',
      'posicion': LatLng(21.5112, -104.8989),
      'horario': 'Lun - Sáb: 9:00 AM - 8:00 PM',
      'imagen': 'assets/veterinaria1.png'
    },
    {
      'id': 'clinica2',
      'nombre': 'Hospital Veterinario del Guitarras',
      'direccion': 'Calle México 456',
      'telefono': '311-234-5678',
      'posicion': LatLng(21.5052, -104.8909),
      'horario': 'Lun - Dom: 24 horas',
      'imagen': 'assets/veterinaria2.png'
    },
    {
      'id': 'clinica3',
      'nombre': 'Clínica para Mascotas El Grapas',
      'direccion': 'Blvd. Tepic-Xalisco 789',
      'telefono': '311-345-6789',
      'posicion': LatLng(21.5092, -104.9009),
      'horario': 'Lun - Vie: 10:00 AM - 7:00 PM',
      'imagen': 'assets/veterinaria3.jpg'
    },
  ];

  Set<Marker> _crearMarcadores() {
    return _clinicas.map((clinica) {
      return Marker(
        markerId: MarkerId(clinica['id']),
        position: clinica['posicion'],
        infoWindow: InfoWindow(
          title: clinica['nombre'],
          snippet: clinica['direccion'],
        ),
        onTap: () {
          setState(() {
            _clinicaSeleccionada = clinica['id'];
          });
        },
      );
    }).toSet();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: _PosicionCamara,
            markers: _crearMarcadores(),
          ),

          if(_clinicaSeleccionada != null)
            Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 15,
                        offset: Offset(0, -4),
                      ),
                    ],
                  ),
                  child: ClinicaDetalle(),
                )
            )
        ],
      ),
    );
  }

  Widget ClinicaDetalle() {
    final clinica = _clinicas.firstWhere(
          (c) => c['id'] == _clinicaSeleccionada,
    );

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Text(clinica['nombre'],
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold
                ),
              ),
              IconButton(
                  onPressed: (){
                    setState(() {
                      _clinicaSeleccionada = null;
                    });
                  },
                  icon: Icon(Icons.close, color: Colors.grey, fontWeight: FontWeight.bold,)
              )
            ],
          ),

          SizedBox(height: 10,),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.place, color: Colores.azulPrimario, size: 18,),
                      SizedBox(width: 8,),
                      Text(clinica['direccion']
                      )
                    ],
                  ),

                  SizedBox(height: 10,),

                  Row(
                    children: [
                      Icon(Icons.phone, color: Colores.azulPrimario, size: 18,),
                      SizedBox(width: 8,),
                      Text(clinica['telefono']
                      )
                    ],
                  ),

                  SizedBox(height: 10,),

                  Row(
                    children: [
                      Icon(Icons.access_time, color: Colores.azulPrimario, size: 18,),
                      SizedBox(width: 8,),
                      Text(clinica['horario']
                      )
                    ],
                  ),
                ],
              ),

              Container(
                  width: 100, height: 100,
                  child: Image.asset(clinica['imagen'], fit: BoxFit.cover,)
              )
            ],
          ),

          SizedBox(height: 16,)
        ],
      ),
    );
  }
}
