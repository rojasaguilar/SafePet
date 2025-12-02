import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:safe_pet_client/pages/home.dart';
import 'package:safe_pet_client/pages/register.dart';
import 'package:safe_pet_client/theme.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final email = TextEditingController();
  final password = TextEditingController();

  bool _ocultarPassword = true;

  Future<void> login() async {
    try {
      final auth = FirebaseAuth.instance;
      final userCredential = await auth.signInWithEmailAndPassword(
        email: email.text.trim(),
        password: password.text.trim(),
      );

      print(userCredential);

      final token = await userCredential.user!.getIdToken();
      print(token);

      Navigator.pushReplacement(context, MaterialPageRoute(builder: (x) => Home()));
    } catch (e) {
      print("Error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al iniciar sesión")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Accede a tu cuenta", style: TextStyle(fontWeight: FontWeight.bold),),
        centerTitle: true,
      ),

      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(30),
          child: Column(
            children: [
              Image.asset(
                  _ocultarPassword ? "assets/login-img.png" : "assets/login-img-close.png",scale: 0.1,
              ),

              Container(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text("¡Hola de nuevo!\nInicia sesión para continuar.", style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold
                    ),
                      textAlign: TextAlign.center,
                    ),

                    SizedBox(height: 15,),

                    TextField(
                      controller: email,
                      decoration: InputDecoration(
                        labelText: "Correo Electrónico",
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colores.azulOscuro
                          )
                        )
                      ),
                    ),
                    SizedBox(height: 30,),
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
                    SizedBox(height: 10,),
                  ],
                ),
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.12),
                        blurRadius: 12,
                        offset: Offset(0, 6),
                      )
                    ]
                ),
              ),

              SizedBox(height: 20,),

              FilledButton(
                onPressed: (){
                  login();
                },
                child: Text("Iniciar sesión", style: TextStyle(
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
                  Text("¿Aún no tienes cuenta?", style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold
                  ),),
                  TextButton(
                      onPressed: (){
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (x) => Register())
                        );
                      },
                      child: Text("Crea una", style: TextStyle(
                        color: Colores.azulPrimario,
                        fontSize: 14,
                        fontWeight: FontWeight.bold
                      ),)
                  )
                ],
              ),
              SizedBox(height: 20,),
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
        ),
      ),
    );
  }
}
