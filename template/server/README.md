# {{ name }}
### 概述
{{ description }}  
前端使用用Vue及ElementUI框架，后端实现RESTful规范的接口与前端进行交互。  

### 使用到的库或框架：
> spring-boot

## 注意事项
1. 后端接口符合RESTful规范
1. 注意后端返回前端的数据，字段名同数据库中的字段名，~~并转为小写~~。
1. Q查询出来的DataTable会根据对应的dao名修正字段名称，小写开头驼峰 如 Name -> name  SiteID -> siteID 
1. DAO类toMapx的Mapx及DAOSet类toDataTable的DataTable会根据dao字段定义修正字段名称。
1. 框架中DataTable字段转换参考DAO类字段定义。其中ID字段自动转换成 id
1. 若数据库表不归框架ORM映射，则需要自行处理字段大小写。

## 目录结构说明
...

### 数据库配置
```
<?xml version="1.0" encoding="UTF-8"?>
<framework>
	<databases>
		<database name="Default">
			<config name="Type">MYSQL</config>
			<config name="ServerAddress">192.168.1.100</config>
			<config name="Port">3306</config>
			<config name="Name">zcms3x_dev</config>
			<config name="UserName">root</config>
			<config name="Password">zving10301</config>
			<config name="MaxConnCount">1000</config>
			<config name="InitConnCount">0</config>
			<config name="TestTable">ZDMaxNo</config>
		</database>
	</databases>
</framework>
```

### 项目启动

com.zving.Boot#main()

### mvn编译后运行
注意配置mvn的zving私有仓库
```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
	
	<localRepository>D:/apache-maven-3.5.0/repo/</localRepository>
	
	<servers>
		<server>
			<id>slimcloud-releases</id>
			<username>deployment</username>
			<password>zvingmaven</password>
		</server>
		<server>
			<id>slimcloud-snapshots</id>
			<username>deployment</username>
			<password>zvingmaven</password>
		</server>
	</servers>
	
	<mirrors>
		<mirror>
			<id>slimcloud</id>
			<mirrorOf>*</mirrorOf>
			<url>http://repo.slimcloud.io/content/groups/public</url>
		</mirror>
	</mirrors>
	
	<profiles>
		<profile>
			<id>slimcloud</id>
			<repositories>
				<repository>
					<id>central</id>
					<url>http://central</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</repository>
			</repositories>
			<pluginRepositories>
				<pluginRepository>
					<id>central</id>
					<url>http://central</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</pluginRepository>
			</pluginRepositories>
		</profile>
	</profiles>
	<activeProfiles>
		<activeProfile>slimcloud</activeProfile>
	</activeProfiles>
</settings> 
```
编译后运行

```
mvn install
java -jar target/zcf-3.0.0-SNAPSHOT.war
```