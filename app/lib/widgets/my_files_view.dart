import 'package:app/dtos/file_metadata.dart';
import 'package:app/services/file_service.dart';
import 'package:app/utils/bytes_formatter_extension.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MyFilesView extends StatefulWidget {
  final Future<List<FileMetadata>> filesMetadata;
  final VoidCallback onRefresh;

  const MyFilesView({
    super.key,
    required this.filesMetadata,
    required this.onRefresh,
  });

  @override
  State<MyFilesView> createState() => _MyFilesViewState();
}

class _MyFilesViewState extends State<MyFilesView> {
  final FileService _fileService = FileService();
  final DateFormat _dateFormat = DateFormat('yyyy-MM-dd');

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: widget.filesMetadata,
      builder: (context, AsyncSnapshot<List<FileMetadata>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        if (snapshot.data!.isEmpty) {
          return const Center(child: Text('No hay archivos disponibles'));
        }
        return ListView.builder(
          scrollDirection: Axis.vertical,
          itemCount: snapshot.data!.length,
          itemBuilder: (context, index) {
            final file = snapshot.data![index];
            return ListTile(
              title: Text(file.name),
              leading: const Icon(Icons.file_copy),
              subtitle: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text('Size:${file.size.toHumanReadableFileSize()}'),
                    const SizedBox(width: 10),
                    Text(_dateFormat.format(
                      DateTime.fromMillisecondsSinceEpoch(file.createdAt),
                    ))
                  ]),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  file.status == 'completed'
                      ? IconButton(
                          icon: Icon(Icons.download,
                              color: Theme.of(context).primaryColor),
                          onPressed: () async {
                            try {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Descargando archivo...'),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                              await _fileService.downloadFile(file);
                              ScaffoldMessenger.of(context)
                                  .hideCurrentSnackBar();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content:
                                        Text('Archivo descargado con éxito'),
                                    behavior: SnackBarBehavior.floating,
                                    backgroundColor: Colors.green,
                                    animation: AnimationController(
                                      vsync: Scaffold.of(context),
                                      duration:
                                          const Duration(milliseconds: 1500),
                                    )),
                              );
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(e.toString()),
                                  behavior: SnackBarBehavior.floating,
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                        )
                      : const SizedBox(
                          width: 25,
                          height: 25,
                          child: CircularProgressIndicator(color: Colors.blue))
                ],
              ),
            );
          },
        );
      },
    );
  }
}
