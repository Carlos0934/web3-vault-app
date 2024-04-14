import 'package:app/dtos/user_profile.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final _baseUrl =
      'https://5csrj3tta5.execute-api.us-east-2.amazonaws.com/prod/api';

  final dio = Dio();

  Future<bool> login({required String email, required String password}) async {
    final response = await dio.post(
      '$_baseUrl/auth/login',
      data: {'email': email, 'password': password},
    );
    if (response.statusCode == 200) {
      final token = response.data['token'];
      print("Token: $token");
      final sharedPreferences = await SharedPreferences.getInstance();

      await sharedPreferences.setString('token', token);
      print("Token: $token");
      return true;
    }

    if (response.statusCode == 401) {
      throw Exception('Correo electrónico o contraseña incorrectos.');
    }

    return response.statusCode == 200;
  }

  Future<bool> register(
      {required String email, phone, required String password}) async {
    final response = await dio.post('$_baseUrl/auth/register',
        data: {'email': email, 'phone': phone, 'password': password});

    return response.statusCode == 200;
  }

  Future<void> logout() async {
    dio.options.headers.remove('Authorization');
  }

  Future<UserProfile> getProfile() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    final token = sharedPreferences.getString('token');

    final response = await dio.get('$_baseUrl/auth/profile',
        options: Options(headers: {'Authorization': 'Bearer $token'}));

    if (response.statusCode == 401) {
      throw Exception('Token expired');
    }

    if (response.statusCode != 200) {
      throw Exception('Error getting profile');
    }

    return UserProfile.fromJson(response.data);
  }

  Future<bool> signOut() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    await sharedPreferences.remove('token');
    dio.options.headers.remove('Authorization');
    return true;
  }
}
