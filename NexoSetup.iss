; -- NexoSetup.iss --
; Inno Setup Script for Nexo Programming Language v3.0.0 "Titan II"

[Setup]
AppName=Nexo Programming Language
AppVersion=3.0.0
DefaultDirName={pf}\Nexo
DefaultGroupName=Nexo
OutputDir=.\Installer
OutputBaseFilename=NexoSetup
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Files]
Source: "NexoCompiler\bin\Release\net9.0\win-x64\publish\Nexo.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "NexoCompiler\bin\Release\net9.0\win-x64\publish\Libs\*"; DestDir: "{app}\libs"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Nexo CLI"; Filename: "{app}\Nexo.exe"

[Registry]
; .nexo file association
Root: HKCR; Subkey: ".nexo"; ValueType: string; ValueName: ""; ValueData: "NexoScript"; Flags: uninsdeletevalue
Root: HKCR; Subkey: "NexoScript"; ValueType: string; ValueName: ""; ValueData: "Nexo Programming Script"; Flags: uninsdeletekey
Root: HKCR; Subkey: "NexoScript\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\Nexo.exe,0"
Root: HKCR; Subkey: "NexoScript\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\Nexo.exe"" ""%1"""

[Code]
// Helper function to add the application directory to the system PATH
procedure CurStepChanged(CurStep: TSetupStep);
var
  Path: string;
begin
  if CurStep = ssPostInstall then
  begin
    if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', Path) then
    begin
      if Pos(ExpandConstant('{app}'), Path) = 0 then
      begin
        RegWriteStringValue(HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', Path + ';' + ExpandConstant('{app}'));
      end;
    end;
  end;
end;
