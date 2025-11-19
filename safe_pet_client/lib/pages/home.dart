import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("SafePet",),
        centerTitle: true,
        backgroundColor: Colors.amberAccent,
        automaticallyImplyLeading: true,
      ),

      body: ListView(
        padding: EdgeInsets.all(30),
        children: [
          Text("Home")
        ],
      ),
    );
  }
}

