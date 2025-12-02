import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/login.dart';
import 'package:safe_pet_client/theme.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:safe_pet_client/config.dart';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final nombre = TextEditingController();
  final apellidos = TextEditingController();
  final email = TextEditingController();
  final telefono = TextEditingController();
  final password = TextEditingController();

  bool _ocultarPassword = true;
  bool _registrando = false;

  Future<void> registrarUsuario() async {
    if (nombre.text.isEmpty ||
        apellidos.text.isEmpty ||
        email.text.isEmpty ||
        telefono.text.isEmpty ||
        password.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Completa todos los campos"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (!email.text.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Ingresa un correo válido"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (password.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("La contraseña debe tener al menos 6 caracteres"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _registrando = true;
    });

    try {
      final url = Uri.parse("${Config.backendUrl}/usuarios");
      final body = {
        "nombre": nombre.text.trim(),
        "apellidos": apellidos.text.trim(),
        "email": email.text.trim(),
        "telefono": telefono.text.trim(),
        "password": password.text,
        "rol": "usuario",
      };

      final resp = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      if (resp.statusCode == 200 || resp.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Cuenta creada exitosamente"),
            backgroundColor: Colors.green,
          ),
        );

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (x) => Login()),
        );
      } else {
        final errorData = jsonDecode(resp.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorData['error'] ?? "Error al crear cuenta"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Error de conexión: ${e.toString()}"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _registrando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Únete a SafePet",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.white),
        backgroundColor: Colores.azulPrimario,
      ),
      backgroundColor: Colores.azulPrimario,
      body: Column(
        children: [
          Container(
            padding: EdgeInsets.all(30),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(child: Icon(Icons.account_box, color: Colors.black,),),
                    SizedBox(width: 15,),
                    Text("Tu nueva cuenta\nempieza aquí",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 35,
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                SizedBox(height: 10,),
                Text("Regístrate en pocos pasos y empieza a disfrutar de todo lo que SafePet tiene para ti.",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          ),

          Expanded(
            child: Container(
              padding: EdgeInsets.all(25),
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    SizedBox(height: 10,),
                    TextField(
                      controller: nombre,
                      decoration: InputDecoration(
                          labelText: "Nombres",
                          prefixIcon: Icon(Icons.person),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: Colores.azulOscuro))),
                    ),
                    SizedBox(height: 20,),
                    TextField(
                      controller: apellidos,
                      decoration: InputDecoration(
                          labelText: "Apellidos",
                          prefixIcon: Icon(Icons.badge),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: Colores.azulOscuro))),
                    ),
                    SizedBox(height: 20,),
                    TextField(
                      controller: email,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                          labelText: "Correo electrónico",
                          prefixIcon: Icon(Icons.email),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: Colores.azulOscuro))),
                    ),
                    SizedBox(height: 20,),
                    TextField(
                      controller: telefono,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                          labelText: "Teléfono",
                          prefixIcon: Icon(Icons.phone),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: Colores.azulOscuro))),
                    ),
                    SizedBox(height: 20,),
                    TextField(
                      controller: password,
                      obscureText: _ocultarPassword,
                      decoration: InputDecoration(
                          labelText: "Contraseña",
                          prefixIcon: Icon(Icons.lock),
                          suffixIcon: IconButton(
                            onPressed: () {
                              setState(() {
                                _ocultarPassword = !_ocultarPassword;
                              });
                            },
                            icon: Icon(
                              _ocultarPassword
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                          ),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: Colores.azulOscuro))),
                    ),
                    SizedBox(height: 25,),
                    FilledButton(
                      onPressed: _registrando ? null : registrarUsuario,
                      child: _registrando
                          ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                          : Text("Crear cuenta",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18),
                      ),
                      style: FilledButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                              horizontal: 85, vertical: 12),
                          backgroundColor: Colores.azulPrimario),
                    ),
                    SizedBox(height: 2,),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text("¿Ya tienes cuenta?",
                          style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        TextButton(
                            onPressed: () {
                              Navigator.pushReplacement(context,
                                  MaterialPageRoute(builder: (x) => Login()));
                            },
                            child: Text("Accede ahora",
                              style: TextStyle(
                                  color: Colores.azulPrimario,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold
                              ),
                            ))
                      ],
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.pets, size: 20,),
                        SizedBox(width: 8,),
                        Text("SafePet",
                          style: TextStyle(
                            color: Colores.azulOscuro,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      ],
                    )
                  ],
                ),
              ),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 12,
                      offset: Offset(0, 6),
                    )
                  ]),
            ),
          ),
        ],
      ),
    );
  }
}