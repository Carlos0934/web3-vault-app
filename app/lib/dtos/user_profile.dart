class UserProfile {
  final String id;
  final String email;
  final String phone;

  UserProfile({required this.id, required this.email, required this.phone});

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      email: json['email'],
      phone: json['phone'],
    );
  }
}
