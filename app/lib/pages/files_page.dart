import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class FilesPage extends StatefulWidget {
  const FilesPage({super.key});

  @override
  State<FilesPage> createState() => _FilesPageState();
}

class _FilesPageState extends State<FilesPage> {
  int _selectedIndex = 0;
  final PageController _pageController = PageController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Files'),
        ),
        body: PageView(
          controller: _pageController,
          onPageChanged: (value) => setState(() => _selectedIndex = value),
          physics: const ClampingScrollPhysics(),
          children: [
            Container(
                child: Center(
              child: Text('Files'),
            )),
            Container(
                child: Center(
              child: Text('Profile'),
            )),
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
              File file = File(result.files.single.path!);
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
