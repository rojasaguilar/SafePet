import 'package:flutter/material.dart';
class PantallaClinicas extends StatelessWidget {
  PantallaClinicas({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title:  Text("Clínicas"),
      centerTitle: true,
      ),
      body:  Center(
        child: Text("Mapa de clínicas"),
      ),
    );
  }
}
