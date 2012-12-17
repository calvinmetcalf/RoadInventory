import arcpy,tempfile
#roadinventory, outputFolder,outputLocation 
roadInv = arcpy.GetParameterAsText(0)
db=arcpy.management.CreatePersonalGDB(tempfile.mkdtemp(),"temp").getOutput(0)
db2=arcpy.management.CreatePersonalGDB(arcpy.GetParameterAsText(1),arcpy.GetParameterAsText(2)).getOutput(0)
arcpy.conversion.FeatureClassToFeatureClass(roadInv,db,"move",''' "FunctionalClassification" >0''')
arcpy.management.Project(db+"//move",db + "//Project","GEOGCS['GCS_WGS_1984',DATUM['D_WGS_1984',SPHEROID['WGS_1984',6378137.0,298.257223563]],PRIMEM['Greenwich',0.0],UNIT['Degree',0.0174532925199433]]","NAD_1983_To_WGS_1984_1","PROJCS['NAD_1983_StatePlane_Massachusetts_Mainland_FIPS_2001',GEOGCS['GCS_North_American_1983',DATUM['D_North_American_1983',SPHEROID['GRS_1980',6378137.0,298.257222101]],PRIMEM['Greenwich',0.0],UNIT['Degree',0.0174532925199433]],PROJECTION['Lambert_Conformal_Conic'],PARAMETER['False_Easting',200000.0],PARAMETER['False_Northing',750000.0],PARAMETER['Central_Meridian',-71.5],PARAMETER['Standard_Parallel_1',41.71666666666667],PARAMETER['Standard_Parallel_2',42.68333333333333],PARAMETER['Latitude_Of_Origin',41.0],UNIT['Meter',1.0]]")
arcpy.management.Dissolve(db + "//Project", db + "//dissolve",["FunctionalClassification"], "", "SINGLE_PART", "UNSPLIT_LINES")
arcpy.cartography.SimplifyLine(db + "//dissolve",db+"//simp","POINT_REMOVE","10 Meters","FLAG_ERRORS","NO_KEEP","NO_CHECK")
arcpy.conversion.FeatureClassToFeatureClass(db+"//simp",db2,"roadInv")