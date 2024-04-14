import 'package:app/pages/files_page.dart';
import 'package:app/pages/register_page.dart';
import 'package:flutter/material.dart';

class LoginForm extends StatelessWidget {
  const LoginForm({super.key});
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const TextField(
              decoration: InputDecoration(
                labelText: 'Correo electrónico',
              ),
            ),
            const SizedBox(height: 20.0),
            const TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Contraseña',
              ),
            ),
            const SizedBox(height: 50.0),
            TextButton(
              onPressed: () {
                // pop up a dialog

                Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => FilesPage()),
                    (route) => false);
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.black,
                minimumSize: Size(double.infinity, 50.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5.0),
                ),
              ),
              child: const Text('Iniciar sesión',
                  style: TextStyle(color: Colors.white)),
            ),
            const SizedBox(height: 20.0),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => RegisterPage()),
                );
              },
              style: TextButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5.0),
                ),
              ),
              child: const Text(
                'Registrarse',
              ),
            ),
          ],
        ));
  }
}
