import 'package:app/pages/home_page.dart';
import 'package:app/pages/register_page.dart';
import 'package:app/services/auth_service.dart';
import 'package:flutter/material.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  var _isSubmitting = false;
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, ingrese un correo electrónico.';
                  }
                  if (!value.contains('@')) {
                    return 'Por favor, ingrese un correo electrónico válido.';
                  }

                  return null;
                },
                decoration: const InputDecoration(
                    labelText: 'Correo electrónico',
                    hintText: 'email@example.com',
                    suffixIcon: Icon(Icons.email)),
              ),
              const SizedBox(height: 20.0),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, ingrese una contraseña.';
                  }
                  if (value.length < 6) {
                    return 'La contraseña debe tener al menos 6 caracteres.';
                  }

                  return null;
                },
                decoration: const InputDecoration(
                    labelText: 'Contraseña',
                    suffixIcon: Icon(Icons.lock_rounded)),
              ),
              const SizedBox(height: 50.0),
              TextButton(
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        // pop up a dialog
                        if (_formKey.currentState!.validate() == false) {
                          return;
                        }

                        setState(() {
                          _isSubmitting = true;
                        });
                        try {
                          await _authService.login(
                              email: _emailController.text,
                              password: _passwordController.text);
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const HomePage()),
                            (route) => false,
                          );
                        } catch (e) {
                          showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: const Text('Error'),
                                content: Text(e.toString()),
                                actions: [
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                    },
                                    child: const Text('Cerrar'),
                                  ),
                                ],
                              );
                            },
                          );
                        } finally {
                          setState(() {
                            _isSubmitting = false;
                          });
                        }
                      },
                style: TextButton.styleFrom(
                  backgroundColor:
                      _isSubmitting ? Colors.black87 : Colors.black,
                  minimumSize: Size(double.infinity, 50.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.white70),
                      )
                    : const Text('Iniciar sesión',
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
          ),
        ));
  }
}
