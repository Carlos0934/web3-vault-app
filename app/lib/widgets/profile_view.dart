import 'package:app/dtos/user_profile.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/utils/bytes_formatter_extension.dart';
import 'package:flutter/material.dart';

class ProfileView extends StatefulWidget {
  final Future<UserProfile?> userProfile;

  const ProfileView({super.key, required this.userProfile});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> {
  final AuthService _authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: widget.userProfile,
      builder: (context, AsyncSnapshot<UserProfile?> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('${snapshot.error}'));
        }
        if (snapshot.data == null) {
          return const Center(child: Text('No hay información disponible'));
        }
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Bienvenido ${snapshot.data!.fullName}',
                    style: const TextStyle(
                      fontSize: 28.0,
                      fontWeight: FontWeight.bold,
                    )),
                const SizedBox(height: 22.0),
                Text(snapshot.data!.email,
                    style: const TextStyle(
                        fontSize: 22.0, fontWeight: FontWeight.w500)),
                const SizedBox(height: 16.0),
                Text(' ${snapshot.data!.phone.toHumanReadablePhoneNumber()}',
                    style: const TextStyle(fontSize: 18.0)),
                const SizedBox(height: 22.0),
                TextButton(
                  style: TextButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    minimumSize: const Size(double.infinity, 50.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5.0),
                    ),
                  ),
                  onPressed: () async {
                    await _authService.signOut();
                    Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(
                            builder: (context) => const LoginPage()),
                        (route) => false);
                  },
                  child: const Text('Cerrar sesión',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18.0,
                      )),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
