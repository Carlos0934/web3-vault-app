import 'package:app/dtos/user_profile.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/utils/bytes_formatter_extension.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../utils/phone_number_extensions.dart';

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
                Image(
                  image: NetworkImage(
                      'https://ui-avatars.com/api/?rounded=true&name=${snapshot.data!.fullName}&size=128&background=0D8ABC&color=fff'),
                  width: 96.0,
                  height: 96.0,
                ),
                const SizedBox(height: 18.0),
                Text(snapshot.data!.fullName,
                    style: const TextStyle(
                        fontSize: 24.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.black)),
                const SizedBox(height: 16.0),
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(5.0),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.mail_outline,
                        color: Colors.black,
                      ),
                      const SizedBox(width: 8.0),
                      Text(snapshot.data!.email,
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              color: Colors.black)),
                    ],
                  ),
                ),
                const SizedBox(height: 16.0),
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(5.0),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.phone,
                        color: Colors.black,
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                          ' ${snapshot.data!.phone.toHumanReadablePhoneNumber()}',
                          style: const TextStyle(fontSize: 18.0)),
                    ],
                  ),
                ),
                const SizedBox(height: 50.0),
                TextButton(
                  style: TextButton.styleFrom(
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
                        color: Colors.red,
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
