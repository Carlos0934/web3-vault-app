import 'dart:io';
import 'package:app/dtos/file_metadata.dart';
import 'package:app/dtos/user_profile.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/services/file_service.dart';
import 'package:app/utils/bytes_formatter_extension.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';

class FilesPage extends StatefulWidget {
  const FilesPage({super.key});

  @override
  State<FilesPage> createState() => _FilesPageState();
}

class _FilesPageState extends State<FilesPage> {
  int _selectedIndex = 0;
  Future<UserProfile?> _userProfile = Future.value(null);
  Future<List<FileMetadata>> _fileMetadata = Future.value([]);
  final AuthService _authService = AuthService();
  final FileService _fileService = FileService();
  final DateFormat _dateFormat = DateFormat('yyyy-MM-dd');

  final PageController _pageController = PageController();

  @override
  void initState() {
    super.initState();
    setState(() {
      _userProfile = _authService.getProfile();
      _fileMetadata = _fileService.listFiles();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Mis archivos'),
        ),
        body: PageView(
          controller: _pageController,
          onPageChanged: (value) => setState(() => _selectedIndex = value),
          physics: const ClampingScrollPhysics(),
          children: [
            FutureBuilder(
              future: _fileMetadata,
              builder: (context, AsyncSnapshot<List<FileMetadata>> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) {
                    final file = snapshot.data![index];
                    return ListTile(
                      title: Text(file.name),
                      leading: const Icon(Icons.file_copy),
                      subtitle: Row(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Size:${file.size.toHumanReadableFileSize()}'),
                            Text(_dateFormat.format(
                              DateTime.fromMicrosecondsSinceEpoch(
                                  file.createdAt),
                            ))
                          ]),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            icon: Icon(Icons.download,
                                color: Theme.of(context).primaryColor),
                            onPressed: () {},
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
            FutureBuilder(
              future: _userProfile,
              builder: (context, AsyncSnapshot<UserProfile?> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('Bienvenido 🚀',
                            style: TextStyle(
                              fontSize: 32.0,
                              fontWeight: FontWeight.bold,
                            )),
                        const SizedBox(height: 22.0),
                        Text(snapshot.data!.email,
                            style: const TextStyle(
                                fontSize: 22.0, fontWeight: FontWeight.w500)),
                        const SizedBox(height: 16.0),
                        Text(snapshot.data!.id,
                            style: TextStyle(fontSize: 18.0)),
                        const SizedBox(height: 16.0),
                        Text(
                            ' ${snapshot.data!.phone.toHumanReadablePhoneNumber()}',
                            style: const TextStyle(fontSize: 18.0)),
                        const SizedBox(height: 64.0),
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
            ),
          ],
        ),
        bottomNavigationBar: BottomAppBar(
          shape: const CircularNotchedRectangle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              IconButton(
                icon: const Icon(Icons.folder, size: 35.0),
                isSelected: _selectedIndex == 0,
                onPressed: () {
                  _pageController.animateToPage(0,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeInOut);
                },
              ),
              IconButton(
                icon: const Icon(Icons.account_circle, size: 35.0),
                isSelected: _selectedIndex == 1,
                onPressed: () {
                  _pageController.animateToPage(1,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeInOut);
                },
              ),
            ],
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
            FilePickerResult? result = await FilePicker.platform.pickFiles();

            if (result != null) {
              await _fileService.uploadFile(result.files.single.path!);
              setState(() {
                _fileMetadata = _fileService.listFiles();
              });
            } else {
              print('No file selected');
            }
          },
          backgroundColor: Theme.of(context).primaryColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30.0),
          ),
          child: Icon(Icons.add, color: Colors.white),
        ));
  }
}
