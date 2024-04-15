import 'package:app/pages/login_page.dart';
import 'package:app/services/auth_service.dart';
import 'package:flutter/material.dart';

class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  var _isSubmitting = false;
  Future _register() async {
    try {
      if (!_formKey.currentState!.validate()) return;
      setState(() {
        _isSubmitting = true;
      });
      await _authService.register(
          email: _emailController.text,
          phone: _phoneController.text,
          password: _passwordController.text,
          fullName: _fullNameController.text);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Te has registrado correctamente 🎉',
              style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString(), style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

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
                controller: _fullNameController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, ingrese su nombre completo.';
                  }

                  return null;
                },
                decoration: const InputDecoration(
                  labelText: 'Nombre completo',
                  hintText: 'Juan Pérez',
                  suffixIcon: Icon(Icons.person),
                ),
              ),
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
                  suffixIcon: Icon(Icons.email),
                ),
              ),
              const SizedBox(height: 20.0),
              TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, ingrese un número de teléfono.';
                  }
                  if (value.length < 10) {
                    return 'Por favor, ingrese un número de teléfono válido.';
                  }

                  return null;
                },
                keyboardType: TextInputType.phone,
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Número de teléfono',
                  suffixIcon: Icon(Icons.phone),
                  hintText: '1234567890',
                  prefixText: '+',
                ),
              ),
              const SizedBox(height: 20.0),
              TextFormField(
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor, ingrese una contraseña.';
                    }
                    if (value.length < 6) {
                      return 'La contraseña debe tener al menos 6 caracteres.';
                    }

                    return null;
                  },
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Contraseña',
                    suffixIcon: Icon(Icons.lock_rounded),
                  )),
              const SizedBox(height: 20.0),
              TextFormField(
                controller: _confirmPasswordController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, confirme la contraseña.';
                  }
                  if (value != _passwordController.text) {
                    return 'Las contraseñas no coinciden.';
                  }

                  return null;
                },
                obscureText: true,
                decoration: const InputDecoration(
                    labelText: 'Confirmar contraseña',
                    suffixIcon: Icon(Icons.lock_rounded)),
              ),
              const SizedBox(height: 50.0),
              TextButton(
                onPressed: _isSubmitting ? null : _register,
                style: TextButton.styleFrom(
                  backgroundColor:
                      _isSubmitting ? Colors.black87 : Colors.black,
                  minimumSize: const Size(double.infinity, 50.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.white70),
                      )
                    : const Text('Registrarse',
                        style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(height: 20.0),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPage()),
                  );
                },
                style: TextButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                ),
                child: const Text(
                  'Volver a inicio de sesión',
                ),
              ),
            ],
          ),
        ));
  }
}
