import 'package:flutter/material.dart';
import 'package:safe_pet_client/pages/citas/Citas.dart';
import 'package:safe_pet_client/pages/clinicas/Clinicas.dart';
import 'package:safe_pet_client/pages/mascotas/Mascota.dart';
import 'package:safe_pet_client/pages/welcome.dart';
import 'package:safe_pet_client/theme.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _indice = 0;

  final List<String> _titulos = [
    "Inicio",
    "Mascotas",
    "Citas",
    "Clínicas Veterinarias"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titulos[_indice], style: TextStyle(
          fontWeight: FontWeight.bold
        ),),
        centerTitle: true,
        automaticallyImplyLeading: false,
        actions: [
          PopupMenuButton(
            icon: Icon(Icons.menu),
            itemBuilder: (context) => [
              PopupMenuItem(child: TextButton(
                onPressed: (){},
                child: Row(
                  children: [
                    Icon(Icons.person, color: Colors.black,),
                    SizedBox(width: 8,),
                    Text("Perfil",
                      style: TextStyle(
                        color: Colors.black
                      ),
                    )
                  ],
                ),
                style: TextButton.styleFrom(
                    padding: EdgeInsets.zero
                ),
              )),
              PopupMenuItem(child: TextButton(
                  onPressed: (){
                    showDialog(
                        context: context,
                        builder: (x) {
                          return AlertDialog(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                            titlePadding: EdgeInsets.only(top: 20, left: 20, right: 20),
                            contentPadding: EdgeInsets.zero,
                            actionsPadding: EdgeInsets.zero,

                            title: Column(
                              children: [
                                Text("¿Salir de tu\ncuenta?",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 10,),
                              ],
                            ),

                            actions: [
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Divider(height: 1, color: Colors.grey.withOpacity(0.3)),

                                  InkWell(
                                    onTap: () {
                                      Navigator.push(context, MaterialPageRoute(builder: (x) => Welcome()));
                                    },
                                    child: Container(
                                      width: double.infinity,
                                      padding: EdgeInsets.symmetric(vertical: 14),
                                      alignment: Alignment.center,
                                      child: Text("Salir",
                                        style: TextStyle(
                                          color: Colors.red,
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),

                                  Divider(height: 1, color: Colors.grey.withOpacity(0.3)),

                                  InkWell(
                                    onTap: () => Navigator.pop(context),
                                    child: Container(
                                      width: double.infinity,
                                      padding: EdgeInsets.symmetric(vertical: 14),
                                      alignment: Alignment.center,
                                      child: Text("Cancelar",
                                        style: TextStyle(
                                          color: Colors.black87,
                                          fontSize: 17,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            ],
                          );
                        }
                    );
                  },
                  child: Row(
                    children: [
                      Icon(Icons.logout, color: Colors.black,),
                      SizedBox(width: 8,),
                      Text("Cerrar sesión",
                        style: TextStyle(
                          color: Colors.black
                        ),
                      )
                    ],
                  ),
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero
                  ),
              )),
            ]
          ),
        ],
      ),
      
      body: contenido(),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _indice,
        onTap: (index) => setState(() => _indice = index),
        items:  [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Inicio",
          ),
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

        selectedItemColor: Colores.azulPrimario,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }

  Widget contenido() {
    switch(_indice) {
      case 0:
        return ListView(
          padding: EdgeInsets.all(25),
          children: [
            Text("Tus Mascotas",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 15),

            tarjetaMascota(
              nombre: "Nombre Mascota",
              raza: "Border Collie",
              fecha: "15-08-2025",
              imagen: "assets/avatar-perro.jpg",
            ),

            SizedBox(height: 20),

            tarjetaMascota(
              nombre: "Nombre Mascota",
              raza: "Gris",
              fecha: "15-08-2021",
              imagen: "assets/avatar-gato.jpg",
            ),

            SizedBox(height: 20),

            Text("Añade Algo +",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),

            SizedBox(height: 15),

            Container(
              child: Stack(
                children: [
                  Column(
                    children: [
                      Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: Colores.azulSecundario.withOpacity(0.2),
                                child: Icon(Icons.pets, size: 24, color: Colores.azulSecundario),
                              ),
                              SizedBox(height: 6,),
                              Text("Agrega una mascota",
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2,),
                              Text("Registra tus mascotas y administra su información.",
                                style: TextStyle(
                                  color: Colors.grey[700],
                                  fontSize: 16,
                                ),
                                textAlign: TextAlign.justify,
                              ),
                            ],
                          ),
                      ),

                      ClipRRect(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(12),
                          bottomRight: Radius.circular(12),
                        ),
                        child: IconButton(
                            onPressed: (){
                              setState(() {
                                _indice = 1;
                              });
                            },
                            icon: Image.asset("assets/inicio-mascotas.jpg",),
                            padding: EdgeInsets.zero,
                        ),
                      ),
                    ],
                  ),

                  Positioned(
                    bottom: 10,
                    right: 10,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colores.azulPrimario,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colores.azulSecundario.withOpacity(0.3),
                            blurRadius: 8,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      child: IconButton(
                        onPressed: () {
                          setState(() {
                            _indice = 1;
                          });
                        },
                        icon: Icon(Icons.add,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          size: 28,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
            ),

            SizedBox(height: 25),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                tarjetaCitasClinicas(
                    titulo: "Citas",
                    descripcion: "Administra\ntus citas fácilmente",
                    imagen: "assets/inicio-cita.png",
                    i: 2
                ),
                tarjetaCitasClinicas(
                    titulo: "Clínicas",
                    descripcion: "Localiza\nclínicas cercanas",
                    imagen: "assets/inicio-veterinaria.png",
                    i: 3
                )
              ],
            )
          ],
        );

      case 1:
        return PantallaMascotas();

      case 2:
        return PantallaCitas();

      case 3:
        return PantallaClinicas();

      default:
        return Center(
          child: Column(
            children: [
              Text("Lo siento, esta página no existe."),
              TextButton(
                  onPressed: (){
                    setState(() {
                      _indice = 0;
                    });
                  },
                  child: Text("Regresar a Inicio", style: TextStyle(color: Colors.black),)
              )
            ],
          ),
        );
    }
  }

  tarjetaMascota({required String nombre, required String raza, required String fecha, required String imagen}) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Row(
        children: [
          CircleAvatar(
            radius: 48,
            backgroundColor: Colores.azulSecundario,
            child: ClipOval(
              child: Image.asset(imagen,
                width: 90, height: 90,
                fit: BoxFit.cover,
              ),
            ),
          ),
          SizedBox(width: 20,),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(nombre,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                    letterSpacing: 0.3,
                  ),
                ),
                SizedBox(height: 6),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.pets,
                        size: 14,
                        color: Colores.azulSecundario,
                        fontWeight: FontWeight.bold,
                      ),
                      SizedBox(width: 6),
                      Text(raza,
                        style: TextStyle(
                          color: Colores.azulSecundario,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    ],
                  ),
                  decoration: BoxDecoration(
                    color: Colores.azulSecundario.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                SizedBox(height: 10),
                Row(
                  children: [
                    Icon(Icons.calendar_month, size: 16, color: Colors.grey[600],),
                    SizedBox(width: 6),
                    Text(fecha,
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
          IconButton(
              onPressed: (){
                setState(() {
                  _indice = 1;
                });
              },
              icon: CircleAvatar(
                radius: 16,
                backgroundColor: Colores.azulPrimario,
                child: Icon(Icons.arrow_forward_ios,
                  size: 18,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              )
          ),
        ],
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
    );
  }

  tarjetaCitasClinicas({required String titulo, required String descripcion, required String imagen, required int i}) {
    return Container(
      padding: EdgeInsets.all(12),
      child: Column(
        children: [
          Text(titulo, style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          Text(descripcion,
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8,),
          Container(
            padding: EdgeInsets.all(15),
            child: IconButton(
                onPressed: (){
                  setState(() {
                    _indice = i;
                  });
                },
                icon: Image.asset(imagen, width: 85, height: 85,),
                padding: EdgeInsets.zero,
            ),
            decoration: BoxDecoration(
              color: Colores.azulSecundario,
              borderRadius: BorderRadius.circular(24),
            ),
          )
        ],
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
    );
  }

}
