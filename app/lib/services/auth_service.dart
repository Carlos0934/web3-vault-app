import 'package:app/dtos/user_profile.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final dio = Dio(BaseOptions(
    baseUrl:
        'https://5csrj3tta5.execute-api.us-east-2.amazonaws.com/prod/api/auth',
  ));

  Future login({required String email, required String password}) async {
    try {
      final response = await dio.post(
        '/login',
        data: {'email': email, 'password': password},
      );
      if (response.statusCode != 200) {
        throw Exception('Error al iniciar sesión.');
      }

      final token = response.data['token'];

      final sharedPreferences = await SharedPreferences.getInstance();

      await sharedPreferences.setString('token', token);
    } catch (e) {
      if (e is DioException) {
        if (e.response?.statusCode == 401) {
          throw Exception('Correo electrónico o contraseña incorrectos.');
        }
      }
      throw Exception(e);
    }
  }

  Future register(
      {required String email,
      phone,
      required String password,
      required String fullName}) async {
    try {
      final response = await dio.post('/register', data: {
        'email': email,
        'phone': phone,
        'password': password,
        'fullName': fullName
      });
      if (response.statusCode != 201) {
        throw Exception('Error registering user');
      }
    } catch (e) {
      if (e is DioException) {
        if (e.response?.statusCode == 409) {
          throw Exception('El correo electrónico ya está en uso.');
        }

        throw Exception('Error al registrar usuario.');
      }
    }
  }

  Future<void> logout() async {
    dio.options.headers.remove('Authorization');
  }

  Future<UserProfile> getProfile() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    final token = sharedPreferences.getString('token');

    final response = await dio.get('/profile',
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
