import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/login.dart';
import 'package:safe_pet_client/theme.dart';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final nombre = TextEditingController();
  final apellidos = TextEditingController();
  final email = TextEditingController();
  final usuario = TextEditingController();
  final password = TextEditingController();

  bool _ocultarPassword = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Únete a SafePet", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),),
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
                Text("Tu nueva cuenta empieza aquí", style: TextStyle(
                    color: Colors.white,
                    fontSize: 35,
                    fontWeight: FontWeight.bold
                ),),
                SizedBox(height: 6,),
                Text("Regístrate en pocos pasos y empieza a disfrutar de todo lo que SafePet tiene para ti.", style: TextStyle(
                  color: Colors.white,
                  fontSize: 16
                ),),
              ],
            ),
          ),

          Expanded(
            child: Container(
              padding: EdgeInsets.all(25),
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
                            borderSide: BorderSide(
                                color: Colores.azulOscuro
                            )
                        )
                    ),
                  ),
                  SizedBox(height: 20,),
                  TextField(
                    controller: apellidos,
                    decoration: InputDecoration(
                        labelText: "Apellidos",
                        prefixIcon: Icon(Icons.badge),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Colores.azulOscuro
                            )
                        )
                    ),
                  ),
                  SizedBox(height: 20,),
                  TextField(
                    controller: email,
                    decoration: InputDecoration(
                        labelText: "Correo electrónico",
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Colores.azulOscuro
                            )
                        )
                    ),
                  ),
                  SizedBox(height: 20,),
                  TextField(
                    controller: usuario,
                    decoration: InputDecoration(
                        labelText: "Nombre de usuario",
                        prefixIcon: Icon(Icons.account_circle),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Colores.azulOscuro
                            )
                        )
                    ),
                  ),
                  SizedBox(height: 20,),
                  TextField(
                    controller: password,
                    obscureText: _ocultarPassword,
                    decoration: InputDecoration(
                        labelText: "Contraseña",
                        prefixIcon: Icon(Icons.lock),
                        suffixIcon: IconButton(
                          onPressed: (){
                            setState(() {
                              _ocultarPassword = !_ocultarPassword;
                            });
                          },
                          icon: Icon(
                            _ocultarPassword ? Icons.visibility : Icons.visibility_off,
                          ),
                        ),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Colores.azulOscuro
                            )
                        )
                    ),
                  ),
                  SizedBox(height: 25,),
                  FilledButton(
                    onPressed: (){
                      Navigator.push(
                          context,
                          MaterialPageRoute(builder: (x)=>Login()));
                    },
                    child: Text("Crear cuenta", style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18
                    ),),
                    style: FilledButton.styleFrom(
                        padding: EdgeInsets.symmetric(horizontal: 85, vertical: 12),
                        backgroundColor: Colores.azulPrimario
                    ),
                  ),
                  SizedBox(height: 2,),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("¿Ya tienes cuenta?", style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold
                      ),),
                      TextButton(
                          onPressed: (){
                            Navigator.push(
                                context,
                                MaterialPageRoute(builder: (x) => Login())
                            );
                          },
                          child: Text("Accede ahora", style: TextStyle(
                              color: Colores.azulPrimario,
                              fontSize: 14,
                              fontWeight: FontWeight.bold
                          ),)
                      )
                    ],
                  ),
                  Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.pets, size: 20,),
                      SizedBox(width: 8,),
                      Text("SafePet", style: TextStyle(
                        color: Colores.azulOscuro,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),)
                    ],
                  )
                ],
              ),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30)
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 12,
                      offset: Offset(0, 6),
                    )
                  ]
              ),
            ),
          ),
        ],
      ),
    );
  }
}
