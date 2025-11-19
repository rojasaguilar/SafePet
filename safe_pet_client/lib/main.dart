import 'package:flutter/material.dart';
import 'Citas.dart';
import 'Clinicas.dart';
import 'Mascota.dart';

void main() {
  runApp(SafePetApp());
}

class SafePetApp extends StatelessWidget {
   SafePetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SafePet Client',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      home:  HomeTabNavigator(),
    );
  }
}

class HomeTabNavigator extends StatefulWidget {
   HomeTabNavigator({super.key});

  @override
  State<HomeTabNavigator> createState() => _HomeTabNavigatorState();
}

class _HomeTabNavigatorState extends State<HomeTabNavigator> {
  int _indice = 0;

  final List<Widget> _screens =  [
    PantallaMascotas(),
    PantallaCitas(),
    PantallaClinicas(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_indice],

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _indice,
        onTap: (index) => setState(() => _indice = index),
        selectedItemColor: Colors.teal,
        unselectedItemColor: Colors.grey,
        items:  [
          BottomNavigationBarItem(
            icon: Icon(Icons.pets),
            label: "Mascotas",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event),
            label: "Citas",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.location_on),
            label: "Clínicas",
          ),
        ],
      ),
    );
  }
}
