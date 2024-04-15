import 'dart:io';

import 'package:app/dtos/file_metadata.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';

class FileService {
  final dio = Dio(BaseOptions(
    baseUrl:
        'https://5csrj3tta5.execute-api.us-east-2.amazonaws.com/prod/api/files',
  ));

  Future<List<FileMetadata>> listFiles() async {
    // Simulate a network request
    final sharedPref = await SharedPreferences.getInstance();
    final token = sharedPref.getString('token');
    final res = await dio.get('',
        options: Options(headers: {'Authorization': 'Bearer $token'}));

    if (res.statusCode != 200) {
      throw Exception('Error getting files');
    }

    final files = res.data
        .map<FileMetadata>((file) => FileMetadata.fromJson(file))
        .toList();

    return files;
  }

  Future<void> uploadFile(String path) async {
    // Simulate a network request
    final sharedPref = await SharedPreferences.getInstance();
    final token = sharedPref.getString('token');
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(path),
    });
    final res = await dio.post('',
        data: formData,
        options: Options(headers: {'Authorization': 'Bearer $token'}));

    if (res.statusCode != 201) {
      throw Exception('Error uploading file');
    }
  }

  Future<void> deleteFile(String key) async {
    // Simulate a network request
    final sharedPref = await SharedPreferences.getInstance();
    final token = sharedPref.getString('token');
    final res = await dio.delete('/$key',
        options: Options(headers: {'Authorization': 'Bearer $token'}));

    if (res.statusCode != 200) {
      throw Exception('Error deleting file');
    }
  }

  Future<void> downloadFile(String key) async {
    final path = await _getDownloadDirectory();
    final sharedPref = await SharedPreferences.getInstance();
    final token = sharedPref.getString('token');
    final res = await dio.get('/$key',
        options: Options(headers: {'Authorization': 'Bearer $token'}));

    if (res.statusCode != 200) {
      throw Exception('Error fetching signed URL');
    }

    final signedUrl = res.data['presignedUrl'];
    final fileName = res.data['name'];

    if (File('$path$fileName').existsSync()) {
      throw Exception('El archivo ya existe');
    }

    final downloadRes = await dio.download(signedUrl, '$path$fileName');

    if (downloadRes.statusCode != 200) {
      throw Exception('Error downloading file');
    }
  }

  Future<String> _getDownloadDirectory() async {
    Directory? dir;

    try {
      if (Platform.isIOS) {
        dir = await getApplicationDocumentsDirectory(); // for iOS
      } else {
        dir = Directory('/storage/emulated/0/Download/'); // for android
        if (!await dir.exists()) dir = (await getExternalStorageDirectory())!;
      }
    } catch (err) {
      print("Cannot get download folder path $err");
    }
    return "${dir?.path}/";
  }
}
