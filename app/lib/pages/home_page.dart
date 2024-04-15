import 'package:app/dtos/file_metadata.dart';
import 'package:app/dtos/user_profile.dart';
import 'package:app/services/auth_service.dart';

import 'package:app/services/file_service.dart';

import 'package:app/widgets/my_files_view.dart';
import 'package:app/widgets/profile_view.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  Future<List<FileMetadata>> _fileMetadata = Future.value([]);
  Future<UserProfile?> _userProfile = Future.value(null);
  final FileService _fileService = FileService();
  final AuthService _authService = AuthService();
  final PageController _pageController = PageController();

  @override
  initState() {
    super.initState();
    setState(() {
      _fileMetadata = _fileService.listFiles();
      _userProfile = _authService.getProfile();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Container(
            margin: const EdgeInsets.only(top: 10.0),
            child: const Text('Web3 vault',
                style: TextStyle(
                    color: Colors.black,
                    fontSize: 28.0,
                    fontWeight: FontWeight.w600)),
          ),
        ),
        body: PageView(
          controller: _pageController,
          onPageChanged: (value) => setState(() => _selectedIndex = value),
          physics: const ClampingScrollPhysics(),
          children: [
            MyFilesView(
                filesMetadata: _fileMetadata,
                onRefresh: () {
                  setState(() {
                    _fileMetadata = _fileService.listFiles();
                  });
                }),
            ProfileView(userProfile: _userProfile),
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
              final uploadFileFuture =
                  _fileService.uploadFile(result.files.single.path!);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Subiendo archivo...'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
              await uploadFileFuture;
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Archivo subido correctamente'),
                  behavior: SnackBarBehavior.floating,
                  backgroundColor: Colors.green,
                ),
              );
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
