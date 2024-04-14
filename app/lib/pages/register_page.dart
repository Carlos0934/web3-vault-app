import 'package:app/widgets/register-form.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                Image(
                  image: AssetImage('assets/logo.png'),
                  width: 250.0,
                ),
                SizedBox(height: 30.0),
                RegisterForm(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
