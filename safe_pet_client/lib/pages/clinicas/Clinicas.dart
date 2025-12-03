import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:math' show cos, sqrt, asin;
import 'package:safe_pet_client/theme.dart';

class PantallaClinicas extends StatefulWidget {
  PantallaClinicas({super.key});

  @override
  State<PantallaClinicas> createState() => _PantallaClinicasState();
}

class _PantallaClinicasState extends State<PantallaClinicas> {
  static LatLng _CentroMapa = LatLng(21.5082, -104.8969);
  String? _clinicaSeleccionada;
  GoogleMapController? _mapController;
  Position? _ubicacionActual;
  bool _cargandoUbicacion = false;
  String? _clinicaMasCercana;
  Set<Polyline> _polylines = {};

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

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _obtenerUbicacion();
    });
  }

  double _calcularDistancia(LatLng punto1, LatLng punto2) {
    const double radioTierra = 6371;

    double lat1 = punto1.latitude * (3.14159265359 / 180);
    double lat2 = punto2.latitude * (3.14159265359 / 180);
    double lon1 = punto1.longitude * (3.14159265359 / 180);
    double lon2 = punto2.longitude * (3.14159265359 / 180);

    double dLat = lat2 - lat1;
    double dLon = lon2 - lon1;

    double a = (1 - cos(dLat)) / 2 +
        cos(lat1) * cos(lat2) * (1 - cos(dLon)) / 2;

    double c = 2 * asin(sqrt(a));

    return radioTierra * c;
  }

  Future<void> _obtenerUbicacion() async {
    setState(() {
      _cargandoUbicacion = true;
    });

    try {
      bool servicioHabilitado;
      LocationPermission permiso;

      servicioHabilitado = await Geolocator.isLocationServiceEnabled();
      if (!servicioHabilitado) {
        setState(() {
          _cargandoUbicacion = false;
        });
        _mostrarMensaje('Por favor activa el GPS en tu dispositivo');
        return;
      }

      permiso = await Geolocator.checkPermission();
      if (permiso == LocationPermission.denied) {
        permiso = await Geolocator.requestPermission();
        if (permiso == LocationPermission.denied) {
          setState(() {
            _cargandoUbicacion = false;
          });
          _mostrarMensaje('Permiso de ubicación denegado');
          return;
        }
      }

      if (permiso == LocationPermission.deniedForever) {
        setState(() {
          _cargandoUbicacion = false;
        });
        _mostrarMensaje('Ve a Ajustes y activa los permisos de ubicación');
        return;
      }

      // Obtener ubicación actual
      Position posicion = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: Duration(seconds: 10),
      ).timeout(
        Duration(seconds: 15),
        onTimeout: () {
          throw Exception('Tiempo de espera agotado');
        },
      );

      setState(() {
        _ubicacionActual = posicion;
        _cargandoUbicacion = false;
      });

      _encontrarClinicaMasCercana();

      _mapController?.animateCamera(
        CameraUpdate.newLatLng(
          LatLng(posicion.latitude, posicion.longitude),
        ),
      );

      _mostrarMensaje('Ubicación obtenida correctamente');
    } catch (e) {
      setState(() {
        _cargandoUbicacion = false;
      });

      String mensaje = 'Error al obtener ubicación';
      if (e.toString().contains('Tiempo de espera agotado')) {
        mensaje = 'No se pudo obtener tu ubicación. Intenta en un lugar con mejor señal GPS';
      } else if (e.toString().contains('PERMISSION')) {
        mensaje = 'Necesitas dar permisos de ubicación';
      }

      _mostrarMensaje(mensaje);
      print('Error detallado: $e');
    }
  }

  void _encontrarClinicaMasCercana() {
    if (_ubicacionActual == null) return;

    LatLng miUbicacion = LatLng(
      _ubicacionActual!.latitude,
      _ubicacionActual!.longitude,
    );

    double distanciaMinima = double.infinity;
    String? idClinicaCercana;

    for (var clinica in _clinicas) {
      double distancia = _calcularDistancia(
        miUbicacion,
        clinica['posicion'],
      );

      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        idClinicaCercana = clinica['id'];
      }
    }

    setState(() {
      _clinicaMasCercana = idClinicaCercana;
    });
  }

  Set<Marker> _crearMarcadores() {
    Set<Marker> marcadores = _clinicas.map((clinica) {
      bool esMasCercana = clinica['id'] == _clinicaMasCercana;

      return Marker(
        markerId: MarkerId(clinica['id']),
        position: clinica['posicion'],
        icon: esMasCercana
            ? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen)
            : BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        infoWindow: InfoWindow(
          title: clinica['nombre'],
          snippet: esMasCercana ? 'MÁS CERCANA' : clinica['direccion'],
        ),
        onTap: () {
          setState(() {
            _clinicaSeleccionada = clinica['id'];
          });
          _mostrarRuta(clinica['posicion']);
        },
      );
    }).toSet();

    // Agregar marcador de ubicación actual
    if (_ubicacionActual != null) {
      marcadores.add(
        Marker(
          markerId: MarkerId('mi_ubicacion'),
          position: LatLng(
            _ubicacionActual!.latitude,
            _ubicacionActual!.longitude,
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueBlue,
          ),
          infoWindow: InfoWindow(title: 'Mi ubicación'),
        ),
      );
    }

    return marcadores;
  }

  void _mostrarRuta(LatLng destino) {
    if (_ubicacionActual == null) return;

    setState(() {
      _polylines.clear();
      _polylines.add(
        Polyline(
          polylineId: PolylineId('ruta'),
          points: [
            LatLng(_ubicacionActual!.latitude, _ubicacionActual!.longitude),
            destino,
          ],
          color: Colores.azulPrimario,
          width: 4,
        ),
      );
    });
  }

  void _mostrarMensaje(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(mensaje)),
    );
  }

  void _irAClinicaMasCercana() {
    if (_clinicaMasCercana == null) {
      _mostrarMensaje('Primero obtén tu ubicación');
      return;
    }

    final clinica = _clinicas.firstWhere(
          (c) => c['id'] == _clinicaMasCercana,
    );

    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(clinica['posicion'], 16),
    );

    setState(() {
      _clinicaSeleccionada = _clinicaMasCercana;
    });

    _mostrarRuta(clinica['posicion']);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: _PosicionCamara,
            markers: _crearMarcadores(),
            polylines: _polylines,
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            onMapCreated: (GoogleMapController controller) {
              _mapController = controller;
            },
          ),

          // Botones
          Positioned(
            top: 50,
            right: 16,
            child: Column(
              children: [
                FloatingActionButton(
                  heroTag: 'ubicacion',
                  mini: true,
                  backgroundColor: Colors.white,
                  onPressed: _cargandoUbicacion ? null : _obtenerUbicacion,
                  child: _cargandoUbicacion
                      ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                      : Icon(Icons.my_location, color: Colores.azulPrimario),
                ),
                SizedBox(height: 10),
                FloatingActionButton(
                  heroTag: 'cercana',
                  mini: true,
                  backgroundColor: Colors.green,
                  onPressed: _irAClinicaMasCercana,
                  child: Icon(Icons.near_me, color: Colors.white),
                ),
              ],
            ),
          ),

          // Card con información de clínica más cercana
          if (_clinicaMasCercana != null && _clinicaSeleccionada == null && _ubicacionActual != null)
            Positioned(
              top: 50,
              left: 16,
              right: 80,
              child: Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(
                    children: [
                      Icon(Icons.location_on, color: Colors.green, size: 28),
                      SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Más cercana',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                            Text(
                              _clinicas.firstWhere(
                                    (c) => c['id'] == _clinicaMasCercana,
                              )['nombre'],
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${_calcularDistancia(
                                LatLng(_ubicacionActual!.latitude, _ubicacionActual!.longitude),
                                _clinicas.firstWhere((c) => c['id'] == _clinicaMasCercana)['posicion'],
                              ).toStringAsFixed(2)} km',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colores.azulPrimario,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // Detalles de clínica seleccionada
          if (_clinicaSeleccionada != null)
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
              ),
            )
        ],
      ),
    );
  }

  Widget ClinicaDetalle() {
    final clinica = _clinicas.firstWhere(
          (c) => c['id'] == _clinicaSeleccionada,
    );

    bool esMasCercana = clinica['id'] == _clinicaMasCercana;
    double? distancia;

    if (_ubicacionActual != null) {
      distancia = _calcularDistancia(
        LatLng(_ubicacionActual!.latitude, _ubicacionActual!.longitude),
        clinica['posicion'],
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(clinica['nombre'],
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (esMasCercana)
                      Container(
                        margin: EdgeInsets.only(top: 4),
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.green,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text('MÁS CERCANA',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () {
                  setState(() {
                    _clinicaSeleccionada = null;
                    _polylines.clear();
                  });
                },
                icon: Icon(Icons.close, color: Colors.grey),
              )
            ],
          ),
          SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.place, color: Colores.azulPrimario, size: 18),
                        SizedBox(width: 8),
                        Expanded(child: Text(clinica['direccion'])),
                      ],
                    ),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Icon(Icons.phone, color: Colores.azulPrimario, size: 18),
                        SizedBox(width: 8),
                        Text(clinica['telefono']),
                      ],
                    ),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Icon(Icons.access_time, color: Colores.azulPrimario, size: 18),
                        SizedBox(width: 8),
                        Expanded(child: Text(clinica['horario'])),
                      ],
                    ),
                    if (distancia != null) ...[
                      SizedBox(height: 10),
                      Row(
                        children: [
                          Icon(Icons.directions_car, color: Colores.azulPrimario, size: 18),
                          SizedBox(width: 8),
                          Text(
                            '${distancia.toStringAsFixed(2)} km de distancia',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.green[700],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              Container(
                width: 100, height: 100,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.asset(
                    clinica['imagen'],
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}