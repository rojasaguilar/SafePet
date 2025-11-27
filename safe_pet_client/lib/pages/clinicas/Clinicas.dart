import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class PantallaClinicas extends StatefulWidget {
   PantallaClinicas({super.key});

  @override
  State<PantallaClinicas> createState() => _PantallaClinicasState();
}

class _PantallaClinicasState extends State<PantallaClinicas> {
  static  LatLng _CentroMapa = LatLng(21.5082, -104.8969);

  static  CameraPosition _PosicionCamara = CameraPosition(
    target: _CentroMapa,
    zoom: 14.0,
  );

  final Set<Marker> _marcadores= {
     Marker(
      markerId: MarkerId('clinica1'),
      position: LatLng(21.5112, -104.8989),
      infoWindow: InfoWindow(
        title: 'Clínica Veterinaria Los cuates',
        snippet: 'Av. Insurgentes 123',
      ),
    ),
     Marker(
      markerId: MarkerId('clinica2'),
      position: LatLng(21.5052, -104.8909),
      infoWindow: InfoWindow(
        title: 'Hospital Veterinario del guitarras',
        snippet: 'Calle México 456',
      ),
    ),
     Marker(
      markerId: MarkerId('clinica3'),
      position: LatLng(21.5092, -104.9009),
      infoWindow: InfoWindow(
        title: 'Clínica para Mascotas El Grapas',
        snippet: 'Blvd. Tepic-Xalisco 789',
      ),
    ),
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GoogleMap(
        initialCameraPosition: _PosicionCamara,
        markers: _marcadores,
      ),
    );
  }
}
