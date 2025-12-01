import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/login.dart';
import 'package:safe_pet_client/pages/register.dart';
import 'package:safe_pet_client/theme.dart';

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colores.azulPrimario,
      appBar: AppBar(
        toolbarHeight: 85,
        backgroundColor: Colores.azulPrimario,
        title: Padding(
          padding: EdgeInsets.only(top: 50),
          child: Text("SafePet", style: TextStyle(
            color: Colors.white,
            fontSize: 48,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.5,
          ),),
        ),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),

      body: Column(
        children: [
          Expanded(
            child: Align(
              alignment: Alignment.bottomCenter,
              child: CircleAvatar(
                child: Image.asset("assets/welcome-img.png"),
                radius: 160,
                backgroundColor: Colors.white,
              ),
            ),
          ),

          Expanded(
            child: Container(
              padding: EdgeInsets.all(35),
              alignment: Alignment.center,
              child: Column(
                children: [
                  Text("Todo para tu mascota en un solo lugar.", style: TextStyle(
                    color: Colors.black,
                    fontSize: 26,
                    fontWeight: FontWeight.bold
                  ),
                  textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 4,),
                  Text("Agenda citas, recibe recordatorios y encuentra clínicas cercanas", style: TextStyle(
                    color: Colores.azulOscuro.withOpacity(0.75),
                    fontSize: 20
                  ),
                  textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 10,),
                  FilledButton(
                      onPressed: (){
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (x) => Login())
                        );
                      },
                      child: Text("Iniciar sesión", style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                      ),),
                      style: FilledButton.styleFrom(
                          padding: EdgeInsets.symmetric(horizontal: 85, vertical: 12),
                          backgroundColor: Colores.azulPrimario
                      ),
                  ),

                  SizedBox(height: 12,),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        height: 1.5,
                        width: 80,
                        color: Colores.azulOscuro.withOpacity(0.25),
                      ),
                      SizedBox(width: 10),
                      Text(
                        "o",
                        style: TextStyle(
                          color: Colores.azulOscuro.withOpacity(0.6),
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(width: 10),
                      Container(
                        height: 1.5,
                        width: 80,
                        color: Colores.azulOscuro.withOpacity(0.25),
                      ),
                    ],
                  ),
                  SizedBox(height: 12,),

                  OutlinedButton(
                      onPressed: (){
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (x) => Register())
                        );
                      },
                      child: Text("Crear cuenta", style: TextStyle(
                        color: Colores.azulOscuro,
                        fontSize: 16
                      ),),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colores.azulOscuro, width: 1.6),
                      ),
                  ),
                ],
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(65),
                  topRight: Radius.circular(65)
                )
              ),
            ),
          )
        ],
      )
    );
  }
}