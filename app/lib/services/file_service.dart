import 'package:app/dtos/file_metadata.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    print(res.data);

    final files = res.data
        .map<FileMetadata>((file) => FileMetadata.fromJson(file))
        .toList();
    await Future.delayed(Duration(seconds: 1));
    print(files);
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
    print(res.statusCode);
    if (res.statusCode != 201) {
      throw Exception('Error uploading file');
    }
  }
}
