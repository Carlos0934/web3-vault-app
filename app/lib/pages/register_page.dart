import 'package:app/widgets/register_form.dart';
import 'package:flutter/material.dart';

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
